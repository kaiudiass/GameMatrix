import { MatchService } from '../service/matchService.js';
import { UserService } from '../service/userService.js';

export const setupSocketHandlers = (io) => {
  // Map of socket.id -> { userId, username, socketId }
  const onlineUsers = new Map();

  const broadcastOnlineUsers = () => {
    const users = Array.from(onlineUsers.values()).map((u) => ({
      id: u.userId,
      username: u.username,
      status: 'online'
    }));
    io.emit('online_users_updated', users);
  };

  io.on('connection', (socket) => {
    // 1. Registro de Presença
    socket.on('register_presence', async (userData) => {
      if (userData && (userData.id || userData.username)) {
        const userId = userData.id || socket.id;
        const username = userData.username || 'Anônimo';

        onlineUsers.set(socket.id, { userId, username, socketId: socket.id });
        socket.userId = userId;
        socket.username = username;

        await UserService.setStatus(userId, 'online');
        broadcastOnlineUsers();
      }
    });

    // 2. Obter lista de usuários online
    socket.on('get_online_users', () => {
      const users = Array.from(onlineUsers.values()).map((u) => ({
        id: u.userId,
        username: u.username,
        status: 'online'
      }));
      socket.emit('online_users_list', users);
    });

    // 3. Criar Partida
    socket.on('create_match', async (hostData) => {
      try {
        const user = hostData || {
          id: socket.userId || socket.id,
          username: socket.username || 'Jogador 1'
        };

        const match = await MatchService.createMatch(user);
        socket.join(match.id);

        socket.emit('match_created', match);
        io.emit('lobby_match_available', { id: match.id, host: user.username });
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao criar partida' });
      }
    });

    // 4. Entrar em Partida existente
    socket.on('join_match', async (data) => {
      try {
        const matchId = typeof data === 'string' ? data : data?.matchId;
        const guest = (typeof data === 'object' && data?.user) || {
          id: socket.userId || socket.id,
          username: socket.username || 'Jogador 2'
        };

        const match = await MatchService.joinMatch(matchId, guest);
        socket.join(matchId);

        io.to(matchId).emit('match_started', match);
        io.to(matchId).emit('match_updated', match);
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao entrar na partida' });
      }
    });

    // 5. Enviar Convite de Partida
    socket.on('send_invite', async ({ targetUserId, targetUsername }) => {
      try {
        let targetSocketId = null;
        for (const [sId, u] of onlineUsers.entries()) {
          if (String(u.userId) === String(targetUserId) || u.username === targetUsername) {
            targetSocketId = sId;
            break;
          }
        }

        const uSender = onlineUsers.get(socket.id);
        const sender = {
          id: uSender?.userId || socket.userId || socket.id,
          username: uSender?.username || socket.username || 'Jogador 1'
        };

        const match = await MatchService.createMatch(sender);
        socket.join(match.id);

        if (targetSocketId && io.sockets.sockets.get(targetSocketId)) {
          io.to(targetSocketId).emit('invite_received', {
            matchId: match.id,
            from: sender
          });
          socket.emit('invite_sent', { matchId: match.id, target: targetUsername, targetUserId });
        } else {
          socket.emit('invite_failed', { message: 'Usuário não está conectado no momento' });
        }
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao enviar convite' });
      }
    });

    // Cancelar Convite enviado
    socket.on('cancel_invite', ({ matchId, targetUserId }) => {
      if (matchId) {
        socket.leave(matchId);
      }
      if (targetUserId) {
        for (const [sId, u] of onlineUsers.entries()) {
          if (String(u.userId) === String(targetUserId)) {
            io.to(sId).emit('invite_cancelled', { matchId });
            break;
          }
        }
      }
    });

    // 6. Aceitar Convite
    socket.on('accept_invite', async ({ matchId }) => {
      try {
        const uGuest = onlineUsers.get(socket.id);
        const guest = {
          id: uGuest?.userId || socket.userId || socket.id,
          username: uGuest?.username || socket.username || 'Jogador 2'
        };

        const match = await MatchService.joinMatch(matchId, guest);
        socket.join(matchId);

        console.log(`[Socket] Partida iniciada na sala ${matchId}: ${match.players?.map(p => p.username).join(' vs ')}`);

        // Notifica ambos os jogadores sobre a confirmação do aceite
        io.to(matchId).emit('invite_accepted', {
          matchId,
          acceptedBy: guest.username,
          match
        });

        io.to(matchId).emit('match_started', match);
        io.to(matchId).emit('match_updated', match);
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao aceitar convite' });
      }
    });

    // 7. Recusar Convite
    socket.on('decline_invite', ({ matchId, senderId }) => {
      if (matchId) {
        io.to(matchId).emit('invite_declined', {
          matchId,
          by: socket.username || 'Oponente'
        });
      }
      if (senderId) {
        for (const [sId, u] of onlineUsers.entries()) {
          if (String(u.userId) === String(senderId)) {
            io.to(sId).emit('invite_declined', {
              matchId,
              by: socket.username || 'Oponente'
            });
            break;
          }
        }
      }
    });

    // 8. Fazer Movimento no Tabuleiro
    socket.on('make_move', async (payload) => {
      try {
        const { matchId, moveIndex, userId } = payload;
        const activeUserId = userId || socket.userId || socket.id;

        const updatedMatch = await MatchService.makeMove(matchId, activeUserId, moveIndex);

        io.to(matchId).emit('move_made', {
          matchId,
          board: updatedMatch.board,
          currentTurn: updatedMatch.currentTurn,
          status: updatedMatch.status,
          winner: updatedMatch.winner,
          winningLine: updatedMatch.winningLine,
          scoreX: updatedMatch.scoreX,
          scoreO: updatedMatch.scoreO,
          roundsPlayed: updatedMatch.roundsPlayed
        });

        io.to(matchId).emit('match_updated', updatedMatch);
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Movimento inválido' });
      }
    });

    // 9. Abandonar Partida (Rendição)
    socket.on('surrender', async ({ matchId, userId }) => {
      try {
        const activeUserId = userId || socket.userId || socket.id;
        const updatedMatch = await MatchService.surrender(matchId, activeUserId);

        io.to(matchId).emit('match_updated', updatedMatch);
        io.to(matchId).emit('player_surrendered', {
          matchId,
          surrenderedBy: activeUserId,
          winner: updatedMatch.winner,
          scoreX: updatedMatch.scoreX,
          scoreO: updatedMatch.scoreO
        });
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao abandonar' });
      }
    });

    // 10. Solicitar Revanche (Jogar Novamente)
    socket.on('request_rematch', async ({ matchId }) => {
      try {
        const activeUserId = socket.userId || socket.id;
        await MatchService.requestRematch(matchId, activeUserId);

        // Notifica o oponente na sala
        socket.to(matchId).emit('rematch_requested', {
          matchId,
          requestedBy: {
            id: activeUserId,
            username: socket.username || 'Oponente'
          }
        });

        // Confirma para quem solicitou que está pendente
        socket.emit('rematch_request_pending', { matchId });
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao solicitar revanche' });
      }
    });

    // 11. Aceitar Revanche
    socket.on('accept_rematch', async ({ matchId }) => {
      try {
        const updatedMatch = await MatchService.acceptRematch(matchId);

        // Notifica TODOS na sala: modal fecha, novo tabuleiro limpo com placar acumulado
        io.to(matchId).emit('rematch_accepted', updatedMatch);
        io.to(matchId).emit('match_updated', updatedMatch);
      } catch (err) {
        socket.emit('match_error', { message: err.message || 'Erro ao aceitar revanche' });
      }
    });

    // 12. Sair da Partida (Voltar ao Lobby)
    socket.on('leave_match', ({ matchId }) => {
      socket.leave(matchId);
      socket.to(matchId).emit('opponent_left', {
        matchId,
        username: socket.username || 'Oponente'
      });
    });

    // 13. Desconexão
    socket.on('disconnect', async () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        await UserService.setStatus(user.userId, 'offline');
        onlineUsers.delete(socket.id);
        broadcastOnlineUsers();
      }
    });
  });
};

export default setupSocketHandlers;
