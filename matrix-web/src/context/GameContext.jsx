import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket, SocketService } from '../service/socket';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [outgoingInvite, setOutgoingInvite] = useState(null);
  const [inviteDeclined, setInviteDeclined] = useState(null);
  const [inviteAcceptedNotice, setInviteAcceptedNotice] = useState(null);
  const [rematchState, setRematchState] = useState('idle'); // 'idle', 'pending', 'requested'
  const [rematchRequester, setRematchRequester] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, isAccent = false) => {
    setLogs((prev) => {
      const newLogs = [...prev, { id: Date.now() + Math.random(), message, isAccent }];
      if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8);
      return newLogs;
    });
  };

  useEffect(() => {
    // 1. Partida criada (se aplicável)
    const onMatchCreated = (newMatch) => {
      setRematchState('idle');
      setRematchRequester(null);
      addLog(`Partida criada [#${newMatch.id}].`, true);
    };

    // 2. Partida iniciada (ambos jogadores conectados)
    const onMatchStarted = (startedMatch) => {
      setIncomingInvite(null);
      setOutgoingInvite(null);
      setInviteDeclined(null);
      setRematchState('idle');
      setRematchRequester(null);
      setMatch(startedMatch);
      addLog(`Partida iniciada [#${startedMatch.id}]!`, true);
    };

    // 3. Atualização geral de partida
    const onMatchUpdated = (updatedMatch) => {
      setMatch((prev) => ({ ...prev, ...updatedMatch }));
    };

    // 4. Movimento realizado
    const onMoveMade = (data) => {
      setMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return {
          ...prev,
          board: data.board,
          currentTurn: data.currentTurn,
          status: data.status,
          winner: data.winner,
          winningLine: data.winningLine,
          scoreX: data.scoreX !== undefined ? data.scoreX : prev.scoreX,
          scoreO: data.scoreO !== undefined ? data.scoreO : prev.scoreO,
          roundsPlayed: data.roundsPlayed !== undefined ? data.roundsPlayed : prev.roundsPlayed
        };
      });
    };

    // 5. Convite recebido no lobby
    const onInviteReceived = (invite) => {
      setIncomingInvite(invite);
      addLog(`${invite.from?.username} convidou você para jogar!`, true);
    };

    // Confirmação de que o convite foi enviado
    const onInviteSent = (data) => {
      setOutgoingInvite({
        matchId: data.matchId,
        targetUsername: data.target,
        targetUserId: data.targetUserId
      });
      setInviteDeclined(null);
      addLog(`Convite enviado para @${data.target}. Aguardando resposta...`, true);
    };

    // Convite cancelado
    const onInviteCancelled = () => {
      setIncomingInvite(null);
      setOutgoingInvite(null);
      addLog('O convite foi cancelado.', false);
    };

    // Convite recusado pelo oponente
    const onInviteDeclined = (data) => {
      setOutgoingInvite(null);
      setInviteDeclined({ by: data.by || 'Oponente' });
      addLog(`Convite recusado por @${data.by}.`, false);
    };

    // Falha no envio do convite
    const onInviteFailed = (data) => {
      setOutgoingInvite(null);
      addLog(data.message || 'Falha ao entregar convite.', false);
    };

    // Convite aceito (notifica ambos antes de entrar na sala)
    const onInviteAccepted = (data) => {
      const isInviter = user && data.acceptedBy !== user.username;
      const msg = isInviter
        ? `@${data.acceptedBy} aceitou o convite!`
        : `Convite aceito!`;

      setIncomingInvite(null);
      setOutgoingInvite(null);
      setInviteDeclined(null);
      setInviteAcceptedNotice({
        message: msg,
        acceptedBy: data.acceptedBy,
        match: data.match
      });

      addLog(`${msg} Entrando na sala...`, true);

      setTimeout(() => {
        setMatch(data.match);
        setInviteAcceptedNotice(null);
      }, 1200);
    };

    // 6. Pedido de Revanche recebido (o outro jogador clicou em jogar novamente)
    const onRematchRequested = (data) => {
      setRematchState('requested');
      setRematchRequester(data.requestedBy);
      addLog(`${data.requestedBy.username} desafiou novamente!`, true);
    };

    // 7. Confirmação de que o pedido de revanche foi enviado
    const onRematchPending = () => {
      setRematchState('pending');
      addLog('Aguardando o oponente aceitar...', true);
    };

    // 8. Revanche aceita por ambos
    const onRematchAccepted = (restartedMatch) => {
      setMatch(restartedMatch);
      setRematchState('idle');
      setRematchRequester(null);
      addLog('Desafio aceito! Nova rodada iniciada.', true);
    };

    // 9. Oponente saiu da sala
    const onOpponentLeft = (data) => {
      addLog(`${data.username} saiu da partida.`, false);
    };

    // 10. Erros
    const onMatchError = (data) => {
      addLog(`[Erro] ${data.message}`, false);
    };

    socket.on('match_created', onMatchCreated);
    socket.on('match_started', onMatchStarted);
    socket.on('match_updated', onMatchUpdated);
    socket.on('move_made', onMoveMade);
    socket.on('invite_received', onInviteReceived);
    socket.on('invite_sent', onInviteSent);
    socket.on('invite_cancelled', onInviteCancelled);
    socket.on('invite_declined', onInviteDeclined);
    socket.on('invite_failed', onInviteFailed);
    socket.on('invite_accepted', onInviteAccepted);
    socket.on('rematch_requested', onRematchRequested);
    socket.on('rematch_request_pending', onRematchPending);
    socket.on('rematch_accepted', onRematchAccepted);
    socket.on('opponent_left', onOpponentLeft);
    socket.on('match_error', onMatchError);

    return () => {
      socket.off('match_created', onMatchCreated);
      socket.off('match_started', onMatchStarted);
      socket.off('match_updated', onMatchUpdated);
      socket.off('move_made', onMoveMade);
      socket.off('invite_received', onInviteReceived);
      socket.off('invite_sent', onInviteSent);
      socket.off('invite_cancelled', onInviteCancelled);
      socket.off('invite_declined', onInviteDeclined);
      socket.off('invite_failed', onInviteFailed);
      socket.off('invite_accepted', onInviteAccepted);
      socket.off('rematch_requested', onRematchRequested);
      socket.off('rematch_request_pending', onRematchPending);
      socket.off('rematch_accepted', onRematchAccepted);
      socket.off('opponent_left', onOpponentLeft);
      socket.off('match_error', onMatchError);
    };
  }, [user]);

  // Determinar símbolo e oponente baseado no usuário logado
  let mySymbol = 'X';
  let opponent = null;

  if (match && user && match.players) {
    const me = match.players.find(
      (p) => String(p.id) === String(user.id) || p.username === user.username
    );
    if (me) {
      mySymbol = me.symbol;
    }
    const opp = match.players.find(
      (p) => String(p.id) !== String(user.id) && p.username !== user.username
    );
    if (opp) {
      opponent = opp;
    }
  }

  const isMyTurn = match?.currentTurn === mySymbol;

  // Placar do jogador logado e do oponente
  const myScore = mySymbol === 'X' ? (match?.scoreX || 0) : (match?.scoreO || 0);
  const opponentScore = mySymbol === 'X' ? (match?.scoreO || 0) : (match?.scoreX || 0);

  // Ações de jogo
  const createMatch = () => {
    SocketService.createMatch({
      id: user?.id,
      username: user?.username || 'Jogador 1'
    });
  };

  const joinMatch = (matchId) => {
    SocketService.joinMatch(matchId, {
      id: user?.id,
      username: user?.username || 'Jogador 2'
    });
  };

  const sendInvite = (targetUserId, targetUsername) => {
    setInviteDeclined(null);
    setOutgoingInvite({
      targetUserId,
      targetUsername,
      status: 'sending'
    });
    SocketService.sendInvite(targetUserId, targetUsername);
  };

  const cancelInvite = () => {
    if (outgoingInvite) {
      SocketService.cancelInvite(outgoingInvite.matchId, outgoingInvite.targetUserId);
      setOutgoingInvite(null);
      addLog('Convite cancelado.', false);
    }
  };

  const clearInviteDeclined = () => {
    setInviteDeclined(null);
  };

  const acceptInvite = (matchId) => {
    SocketService.acceptInvite(matchId);
    setIncomingInvite(null);
  };

  const declineInvite = (matchId, senderId) => {
    SocketService.declineInvite(matchId, senderId);
    setIncomingInvite(null);
    addLog('Você recusou o convite.', false);
  };

  const makeMove = (index) => {
    if (!match) return;
    SocketService.makeMove(match.id, index, user?.id);
  };

  const surrender = () => {
    if (!match) return;
    SocketService.surrender(match.id, user?.id);
    addLog('Você abandonou a partida.', false);
  };

  const requestRematch = () => {
    if (!match) return;
    SocketService.requestRematch(match.id);
  };

  const acceptRematch = () => {
    if (!match) return;
    SocketService.acceptRematch(match.id);
  };

  // Se sair para o lobby, limpa a partida local para que ao entrar dnv seja uma partida nova com placar zerado
  const leaveMatch = () => {
    if (match) {
      SocketService.leaveMatch(match.id);
    }
    setMatch(null);
    setRematchState('idle');
    setRematchRequester(null);
    setOutgoingInvite(null);
    setIncomingInvite(null);
    setInviteDeclined(null);
    setInviteAcceptedNotice(null);
  };

  const value = {
    match,
    board: match?.board || Array(9).fill(null),
    currentTurn: match?.currentTurn || 'X',
    mySymbol,
    opponent,
    isMyTurn,
    status: match?.status || 'idle',
    winner: match?.winner,
    winningLine: match?.winningLine,
    scoreX: match?.scoreX || 0,
    scoreO: match?.scoreO || 0,
    myScore,
    opponentScore,
    roundsPlayed: match?.roundsPlayed || 0,
    incomingInvite,
    outgoingInvite,
    inviteDeclined,
    inviteAcceptedNotice,
    rematchState,
    rematchRequester,
    logs,
    addLog,
    createMatch,
    joinMatch,
    sendInvite,
    cancelInvite,
    clearInviteDeclined,
    acceptInvite,
    declineInvite,
    makeMove,
    surrender,
    requestRematch,
    acceptRematch,
    leaveMatch
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
}

export default GameContext;
