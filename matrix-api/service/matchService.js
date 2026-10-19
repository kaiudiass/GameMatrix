import crypto from 'crypto';
import { MatchRepository } from '../repository/matchRepository.js';
import { WINNING_COMBINATIONS, MATCH_STATUS } from '../config/utils/constants.js';
import { NotFoundException, ValidationException, ForbiddenException } from '../config/exceptions/index.js';

export const MatchService = {
  checkWinner(board) {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          winner: board[a],
          line: combination
        };
      }
    }

    const isDraw = board.every((cell) => cell !== null);
    if (isDraw) {
      return { winner: 'DRAW', line: null };
    }

    return null;
  },

  async createMatch(hostUser = {}) {
    const id = '0x' + crypto.randomBytes(2).toString('hex').toUpperCase();
    const hostId = hostUser?.id || 'player-x';
    const hostUsername = hostUser?.username || 'Jogador 1';

    const matchData = {
      id,
      playerXId: typeof hostId === 'number' ? hostId : null,
      players: [
        {
          id: hostId,
          username: hostUsername,
          symbol: 'X'
        }
      ],
      board: Array(9).fill(null),
      currentTurn: 'X',
      status: MATCH_STATUS.WAITING,
      winner: null,
      winningLine: null,
      scoreX: 0,
      scoreO: 0,
      roundsPlayed: 0,
      rematchRequestedBy: null,
      createdAt: new Date()
    };

    return MatchRepository.create(matchData);
  },

  async joinMatch(matchId, guestUser = {}) {
    const match = await MatchRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    const guestId = guestUser?.id || 'player-o';
    const guestUsername = guestUser?.username || 'Jogador 2';

    if (match.players && match.players.length >= 2) {
      const isAlreadyPlaying = match.players.some((p) => String(p.id) === String(guestId));
      if (isAlreadyPlaying) return match;
      throw new ValidationException('Partida já possui 2 jogadores');
    }

    const updatedPlayers = [
      ...(match.players || []),
      {
        id: guestId,
        username: guestUsername,
        symbol: 'O'
      }
    ];

    await MatchRepository.update(matchId, {
      players: updatedPlayers,
      playerOId: typeof guestId === 'number' ? guestId : null,
      status: MATCH_STATUS.IN_PROGRESS
    });

    return {
      ...match,
      players: updatedPlayers,
      status: MATCH_STATUS.IN_PROGRESS
    };
  },

  async makeMove(matchId, userId, moveIndex) {
    const match = await MatchRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    if (match.status !== MATCH_STATUS.IN_PROGRESS) {
      throw new ValidationException('A partida não está em andamento');
    }

    const numericIndex = Number(moveIndex);
    if (isNaN(numericIndex) || numericIndex < 0 || numericIndex > 8 || match.board[numericIndex] !== null) {
      throw new ValidationException('Posição ocupada ou índice inválido');
    }

    const player = match.players.find((p) => String(p.id) === String(userId));
    if (!player) {
      throw new ForbiddenException('Jogador não pertence a esta partida');
    }

    if (player.symbol !== match.currentTurn) {
      throw new ValidationException('Aguarde o seu turno');
    }

    const newBoard = [...match.board];
    newBoard[numericIndex] = player.symbol;

    const result = this.checkWinner(newBoard);
    let newStatus = match.status;
    let winner = null;
    let winningLine = null;
    let nextTurn = match.currentTurn;
    let newScoreX = match.scoreX || 0;
    let newScoreO = match.scoreO || 0;
    let newRoundsPlayed = match.roundsPlayed || 0;

    if (result) {
      newRoundsPlayed += 1;
      if (result.winner === 'DRAW') {
        newStatus = MATCH_STATUS.DRAW;
        winner = 'DRAW';
      } else {
        newStatus = MATCH_STATUS.FINISHED;
        winner = player.symbol;
        winningLine = result.line;

        // Atualiza o placar persistido no banco
        if (winner === 'X') {
          newScoreX += 1;
        } else if (winner === 'O') {
          newScoreO += 1;
        }
      }
    } else {
      nextTurn = match.currentTurn === 'X' ? 'O' : 'X';
    }

    const updatedData = {
      board: newBoard,
      currentTurn: nextTurn,
      status: newStatus,
      winner,
      winningLine,
      scoreX: newScoreX,
      scoreO: newScoreO,
      roundsPlayed: newRoundsPlayed,
      winnerId: winner && winner !== 'DRAW' && typeof player.id === 'number' ? player.id : null,
      endedAt: newStatus !== MATCH_STATUS.IN_PROGRESS ? new Date() : null
    };

    await MatchRepository.update(matchId, updatedData);

    return {
      ...match,
      ...updatedData
    };
  },

  async surrender(matchId, userId) {
    const match = await MatchRepository.findById(matchId);
    if (!match) throw new NotFoundException('Partida não encontrada');

    const player = match.players.find((p) => String(p.id) === String(userId));
    if (!player) throw new ForbiddenException('Jogador não pertence a esta partida');

    const opponent = match.players.find((p) => String(p.id) !== String(userId));
    const winnerSymbol = opponent ? opponent.symbol : (player.symbol === 'X' ? 'O' : 'X');

    let newScoreX = match.scoreX || 0;
    let newScoreO = match.scoreO || 0;
    if (winnerSymbol === 'X') newScoreX += 1;
    if (winnerSymbol === 'O') newScoreO += 1;

    const updatedData = {
      status: MATCH_STATUS.FINISHED,
      winner: winnerSymbol,
      scoreX: newScoreX,
      scoreO: newScoreO,
      roundsPlayed: (match.roundsPlayed || 0) + 1,
      endedAt: new Date()
    };

    await MatchRepository.update(matchId, updatedData);

    return {
      ...match,
      ...updatedData
    };
  },

  async requestRematch(matchId, userId) {
    const match = await MatchRepository.findById(matchId);
    if (!match) throw new NotFoundException('Partida não encontrada');

    const player = match.players.find((p) => String(p.id) === String(userId));
    if (!player) throw new ForbiddenException('Jogador não pertence a esta partida');

    await MatchRepository.update(matchId, { rematchRequestedBy: userId });
    return match;
  },

  async acceptRematch(matchId) {
    const match = await MatchRepository.findById(matchId);
    if (!match) throw new NotFoundException('Partida não encontrada');

    // Mantém o placar acumulado e zera o tabuleiro para a nova rodada
    const updatedData = {
      board: Array(9).fill(null),
      currentTurn: 'X',
      status: MATCH_STATUS.IN_PROGRESS,
      winner: null,
      winningLine: null,
      rematchRequestedBy: null,
      endedAt: null
    };

    await MatchRepository.update(matchId, updatedData);

    return {
      ...match,
      ...updatedData
    };
  },

  async getMatch(matchId) {
    const match = await MatchRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }
    return match;
  },

  getActiveMatches() {
    return MatchRepository.findAllActive();
  }
};

export default MatchService;
