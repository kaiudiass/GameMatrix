import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useGame } from '../../hooks/useGame';
import { userService } from '../../service/userService';
import styles from './LobbyPage.module.css';

export function LobbyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { onlineUsers } = useSocket();
  const {
    match,
    incomingInvite,
    outgoingInvite,
    inviteDeclined,
    inviteAcceptedNotice,
    logs,
    sendInvite,
    cancelInvite,
    clearInviteDeclined,
    acceptInvite,
    declineInvite
  } = useGame();

  const [dbUsers, setDbUsers] = useState([]);
  const [inviteSeconds, setInviteSeconds] = useState(25);

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Se uma partida estiver ativa e o aviso de aceite tiver finalizado, navega para o jogo
  useEffect(() => {
    if (match?.id && match?.status === 'in_progress' && !inviteAcceptedNotice) {
      navigate('/game');
    }
  }, [match, inviteAcceptedNotice, navigate]);

  // Carrega lista de usuários do backend
  useEffect(() => {
    userService.getUsers()
      .then((users) => setDbUsers(users))
      .catch(() => {});
  }, []);

  // Timer do convite recebido (25s)
  useEffect(() => {
    let timer;
    if (incomingInvite) {
      setInviteSeconds(25);
      timer = setInterval(() => {
        setInviteSeconds((s) => {
          if (s <= 1) {
            declineInvite(incomingInvite.matchId, incomingInvite.from?.id);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingInvite, declineInvite]);

  // Combina usuários do banco e do socket para exibir na lista
  const displayUsers = React.useMemo(() => {
    const list = [...dbUsers];
    // Mescla status com usuários online do socket
    const onlineMap = new Map();
    onlineUsers.forEach((u) => onlineMap.set(String(u.id), u));

    // Remove o usuário atual da lista de oponentes
    return list
      .filter((u) => String(u.id) !== String(user?.id) && u.username !== user?.username)
      .map((u) => {
        const isOnline = onlineMap.has(String(u.id)) || u.status === 'online';
        return {
          ...u,
          status: isOnline ? 'online' : (u.status || 'offline')
        };
      });
  }, [dbUsers, onlineUsers, user]);

  const handleInvite = (peer) => {
    sendInvite(peer.id, peer.username);
  };

  const handleCancelInvite = () => {
    cancelInvite();
  };

  const handleAccept = () => {
    if (incomingInvite) {
      acceptInvite(incomingInvite.matchId);
    }
  };

  const handleDecline = () => {
    if (incomingInvite) {
      declineInvite(incomingInvite.matchId, incomingInvite.from?.id);
    }
  };

  return (
    <Layout activePath="lobby">
      <div className={styles.container}>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusInner}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>
              ONLINE: ({Math.max(1, onlineUsers.length)})
            </span>
          </div>
        </div>

        {/* Lista de Jogadores */}
        <div className={styles.peersContainer}>
          {displayUsers.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', opacity: 0.7, fontFamily: 'JetBrains Mono, monospace' }}>
              &gt; Aguardando outros jogadores entrarem no lobby...
            </div>
          ) : (
            displayUsers.map((peer) => {
              const isOnline = peer.status === 'online';
              const isBusy = peer.status === 'busy' || peer.status === 'in_game';

              return (
                <div 
                  key={peer.id} 
                  className={`${styles.peerCard} ${isBusy ? styles.peerCardBusy : ''}`}
                >
                  <div className={styles.peerInfo}>
                    <div className={styles.peerNameRow}>
                      <span className={styles.peerArrow}>&gt;</span>
                      <span className={styles.peerName}>{peer.username}</span>
                    </div>
                    <span className={isBusy ? styles.peerStatusBusy : styles.peerStatus}>
                      [{isBusy ? 'EM JOGO' : isOnline ? 'DISPONÍVEL' : 'OFFLINE'}]
                    </span>
                  </div>

                  {isBusy ? (
                    <span className={styles.badgeBusy}>[ OCUPADO ]</span>
                  ) : (
                    <button 
                      className={styles.btnInvite} 
                      type="button" 
                      onClick={() => handleInvite(peer)}
                      disabled={!isOnline || !!outgoingInvite}
                    >
                      [ CONVIDAR ]
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal 1: Convite Enviado (Quem convidou aguarda resposta no lobby) */}
        {outgoingInvite && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.glowBar} />
              <div className={styles.modalHeader}>
                [ CONVITE ENVIADO ]
              </div>
              <div className={styles.modalBody}>
                <span className={`material-symbols-outlined ${styles.modalPulseIcon}`}>
                  wifi_tethering
                </span>
                <p className={styles.modalText}>
                  Convite enviado para <span className={styles.highlightPlayer}>@{outgoingInvite.targetUsername}</span>
                </p>
                <span className={styles.modalSubText}>
                  Aguardando resposta do oponente...
                </span>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnModalCancel} type="button" onClick={handleCancelInvite}>
                  [ CANCELAR CONVITE ]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Convite Recebido (Quem foi convidado recebe o aviso) */}
        {incomingInvite && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.glowBar} />
              <div className={styles.modalHeader}>
                [ CONVITE DE PARTIDA ]
              </div>
              <div className={styles.modalBody}>
                <span className={`material-symbols-outlined ${styles.modalInviteIcon}`}>
                  sports_esports
                </span>
                <p className={styles.modalText}>
                  <span className={styles.highlightPlayer}>@{incomingInvite.from?.username}</span> convidou você para jogar!
                </p>
                <div className={styles.inviteMetaRow}>
                  <span>MODO: CLÁSSICO</span>
                  <span>•</span>
                  <span className={styles.inviteTimer}>
                    EXPIRA EM: {inviteSeconds.toString().padStart(2, '0')}S
                  </span>
                </div>
              </div>
              <div className={styles.modalActionsDual}>
                <button className={styles.btnModalAccept} type="button" onClick={handleAccept}>
                  [ ACEITAR ]
                </button>
                <button className={styles.btnModalDecline} type="button" onClick={handleDecline}>
                  [ RECUSAR ]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Convite Recusado (Quem convidou é avisado que o oponente recusou) */}
        {inviteDeclined && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.glowBar} style={{ backgroundColor: 'var(--error)', boxShadow: '0 0 1rem var(--error)' }} />
              <div className={styles.modalHeader} style={{ color: 'var(--error)' }}>
                [ CONVITE RECUSADO ]
              </div>
              <div className={styles.modalBody}>
                <span className={`material-symbols-outlined ${styles.modalErrorIcon}`}>
                  cancel
                </span>
                <p className={styles.modalText}>
                  O jogador <span className={styles.highlightPlayer}>@{inviteDeclined.by}</span> recusou o convite.
                </p>
                <span className={styles.modalSubText}>
                  Você continua no lobby e pode convidar outro jogador.
                </span>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnModalClose} type="button" onClick={clearInviteDeclined}>
                  [ FECHAR ]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Convite Aceito (Ambos veem o aviso de que foi aceito antes de entrar na sala) */}
        {inviteAcceptedNotice && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.glowBar} />
              <div className={styles.modalHeader}>
                [ CONVITE ACEITO ]
              </div>
              <div className={styles.modalBody}>
                <span className={`material-symbols-outlined ${styles.modalSuccessIcon}`}>
                  check_circle
                </span>
                <p className={styles.modalText}>
                  {inviteAcceptedNotice.message}
                </p>
                <span className={styles.modalSubText}>
                  Iniciando partida e entrando na sala...
                </span>
              </div>
              <div className={styles.modalLoadingBar}>
                <div className={styles.modalLoadingFill} />
              </div>
            </div>
          </div>
        )}

        {/* Live Logs */}
        {logs.length > 0 && (
          <div className={styles.logBox}>
            {logs.map((log) => (
              <p key={log.id} className={log.isAccent ? styles.logAccent : styles.logNormal}>
                &gt; {log.message}
              </p>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default LobbyPage;
