import { Match } from './models/Match.js';
import { User } from './models/User.js';

// Cache em memória para atualizações instantâneas de socket
const activeMatches = new Map();

export const MatchRepository = {
  async create(matchData) {
    const formatted = {
      ...matchData,
      scoreX: matchData.scoreX || 0,
      scoreO: matchData.scoreO || 0,
      roundsPlayed: matchData.roundsPlayed || 0
    };

    activeMatches.set(formatted.id, formatted);

    try {
      await Match.create({
        id: formatted.id,
        playerXId: typeof formatted.playerXId === 'number' ? formatted.playerXId : null,
        status: formatted.status || 'waiting',
        board: formatted.board,
        currentTurn: formatted.currentTurn || 'X',
        scoreX: formatted.scoreX,
        scoreO: formatted.scoreO,
        roundsPlayed: formatted.roundsPlayed
      });
    } catch (err) {
      console.warn('[MatchRepository] Aviso no banco ao criar partida:', err.message);
    }

    return formatted;
  },

  async findById(id) {
    if (activeMatches.has(id)) {
      return activeMatches.get(id);
    }

    try {
      const match = await Match.findByPk(id, {
        include: [
          { model: User, as: 'playerX', attributes: ['id', 'username'] },
          { model: User, as: 'playerO', attributes: ['id', 'username'] }
        ]
      });

      if (match) {
        const plain = match.get({ plain: true });
        const formatted = {
          id: plain.id,
          players: [
            plain.playerX ? { id: plain.playerX.id, username: plain.playerX.username, symbol: 'X' } : null,
            plain.playerO ? { id: plain.playerO.id, username: plain.playerO.username, symbol: 'O' } : null
          ].filter(Boolean),
          board: plain.board,
          currentTurn: plain.currentTurn,
          status: plain.status,
          winner: plain.winnerId,
          scoreX: plain.scoreX || 0,
          scoreO: plain.scoreO || 0,
          roundsPlayed: plain.roundsPlayed || 0
        };
        activeMatches.set(id, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('[MatchRepository] Aviso no banco em findById:', err.message);
    }

    return null;
  },

  async update(id, fields) {
    const cached = activeMatches.get(id);
    if (cached) {
      Object.assign(cached, fields);
      activeMatches.set(id, cached);
    }

    try {
      const dbFields = {};
      if (fields.board !== undefined) dbFields.board = fields.board;
      if (fields.currentTurn !== undefined) dbFields.currentTurn = fields.currentTurn;
      if (fields.status !== undefined) dbFields.status = fields.status;
      if (fields.winnerId !== undefined) dbFields.winnerId = fields.winnerId;
      if (fields.playerOId !== undefined) dbFields.playerOId = fields.playerOId;
      if (fields.scoreX !== undefined) dbFields.scoreX = fields.scoreX;
      if (fields.scoreO !== undefined) dbFields.scoreO = fields.scoreO;
      if (fields.roundsPlayed !== undefined) dbFields.roundsPlayed = fields.roundsPlayed;
      if (fields.endedAt !== undefined) dbFields.endedAt = fields.endedAt;

      await Match.update(dbFields, { where: { id } });
    } catch (err) {
      console.warn('[MatchRepository] Aviso no banco ao atualizar:', err.message);
    }

    return cached;
  },

  findAllActive() {
    return Array.from(activeMatches.values());
  }
};

export default MatchRepository;
