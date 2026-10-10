import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import styles from './LobbyPage.module.css';

export function LobbyPage() {
  const navigate = useNavigate();
  const [inviteSeconds, setInviteSeconds] = useState(24);
  const [showInvite, setShowInvite] = useState(true);
  const [inviteStatus, setInviteStatus] = useState('pending'); // 'pending', 'accepted', 'declined'
  const [logs, setLogs] = useState([]);

  const addLog = (message, isAccent = false) => {
    setLogs(prev => {
      const newLogs = [...prev, { id: Date.now(), message, isAccent }];
      if (newLogs.length > 5) return newLogs.slice(1);
      return newLogs;
    });
  };

  useEffect(() => {
    let timer;
    if (showInvite && inviteStatus === 'pending' && inviteSeconds > 0) {
      timer = setInterval(() => setInviteSeconds(s => s - 1), 1000);
    } else if (inviteSeconds === 0 && inviteStatus === 'pending') {
      handleDecline('Convite expirado por limite de timeout (RTT).');
    }
    return () => clearInterval(timer);
  }, [showInvite, inviteSeconds, inviteStatus]);

  const handleAccept = () => {
    setInviteStatus('accepted');
    addLog('Convite aceito. Sincronizando semente RNG...', true);
    setTimeout(() => {
      navigate('/game');
    }, 2000);
  };

  const handleDecline = (reason = 'Convite rejeitado pelo usuário.') => {
    setInviteStatus('declined');
    setShowInvite(false);
    addLog(reason, false);
  };

  const handleCreateMatch = () => {
    addLog('Host de partida instanciado na porta 7734. Aguardando peer...', true);
  };

  const handleInvite = (peerName) => {
    addLog(`Disparando handshake de desafio para @${peerName}...`, true);
  };

  return (
    <Layout activePath="lobby">
      <div className={styles.container}>

        {/* Status Bar */}
          <div className={styles.statusBar}>
          <div className={styles.statusInner}>
            <span className={styles.statusText}>&nbsp;ONLINE: (04)</span>
          </div>
        </div>

        {/* Quick Action Create Room */}
        <button className={styles.btnCreate} type="button" onClick={handleCreateMatch}>
          <span className={styles.btnCreateText}>
            <span className={styles.btnCreateArrow}>&gt;</span> [ + CRIAR PARTIDA ]
          </span>
          <span className={styles.btnCreatePort}>PORT: 7734</span>
        </button>

        {/* Peers List */}
        <div className={styles.peersContainer}>
          {/* Player 1 */}
          <div className={styles.peerCard}>
            <div className={styles.peerInfo}>
              <div className={styles.peerNameRow}>
                <span className={styles.peerArrow}>&gt;</span>
                <span className={styles.peerName}>user_neo</span>
              </div>
              <span className={styles.peerStatus}>[DISPONÍVEL] · ELO:1480</span>
            </div>
            <button className={styles.btnInvite} type="button" onClick={() => handleInvite('user_neo')}>
              [ CONVIDAR ]
            </button>
          </div>

          {/* Player 2 */}
          <div className={styles.peerCard}>
            <div className={styles.peerInfo}>
              <div className={styles.peerNameRow}>
                <span className={styles.peerArrow}>&gt;</span>
                <span className={styles.peerName}>user_cipher</span>
              </div>
              <span className={styles.peerStatus}>[DISPONÍVEL] · ELO:1220</span>
            </div>
            <button className={styles.btnInvite} type="button" onClick={() => handleInvite('user_cipher')}>
              [ CONVIDAR ]
            </button>
          </div>

          {/* Player 3 (Busy) */}
          <div className={`${styles.peerCard} ${styles.peerCardBusy}`}>
            <div className={styles.peerInfo}>
              <div className={styles.peerNameRow}>
                <span className={styles.peerHash}>#</span>
                <span className={styles.peerNameBusy}>user_trinity</span>
              </div>
              <span className={styles.peerStatusBusy}>[EM PARTIDA] · 03M_DECORRIDO</span>
            </div>
            <span className={styles.badgeBusy}>
              [ OCUPADO ]
            </span>
          </div>
        </div>
        {/* Invitation Manager */}
        {showInvite && (
          <div className={`${styles.inviteBox} ${inviteStatus !== 'pending' ? styles.inviteBoxDisabled : ''}`}>
            <div className={styles.inviteHeader}>
              ┌─ CONVITE RECEBIDO ────────────────────────────────────┐
            </div>

            {inviteStatus === 'pending' ? (
              <>
                <div className={styles.inviteBody}>
                  <div className={styles.inviteTextRow}>
                    <span className={`material-symbols-outlined ${styles.inviteIcon}`}>cloud_upload</span>
                    <p className={styles.inviteText}>
                      <span className={styles.invitePlayer}>'user_morpheus'</span> desafiou você para uma partida 3x3 no grid neural.
                    </p>
                  </div>
                  <div className={styles.inviteMetaRow}>
                    <span>MODO: BLITZ_RAPIDO</span>
                    <span>•</span>
                    <span className={styles.inviteTimer}>EXPIRA EM: {inviteSeconds.toString().padStart(2, '0')}S</span>
                  </div>
                </div>

                <div className={styles.inviteActions}>
                  <button className={styles.btnAccept} type="button" onClick={handleAccept}>
                    [ ACEITAR ]
                  </button>
                  <button className={styles.btnDecline} type="button" onClick={() => handleDecline()}>
                    [ RECUSAR ]
                  </button>
                </div>
              </>
            ) : inviteStatus === 'accepted' ? (
              <div className={styles.acceptedContainer}>
                <span className={`animate-crt-pulse ${styles.acceptedTitle}`}>
                  [ CONEXÃO ESTABELECIDA ]
                </span>
                <span className={styles.acceptedSub}>
                  CARREGANDO MATRIX 3X3 CONTRA user_morpheus...
                </span>
              </div>
            ) : null}

            <div className={styles.inviteFooter}>
              └───────────────────────────────────────────────────────┘
            </div>
          </div>
        )}

        {/* Terminal Live Log Stream */}
        {logs.length > 0 && (
          <div className={styles.logBox}>
            {logs.map(log => (
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
