import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import styles from './MatchPage.module.css';

export function MatchPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [abandonState, setAbandonState] = useState('default'); // 'default', 'confirm', 'surrendered'
  const [seconds, setSeconds] = useState(14);
  const [gameOver, setGameOver] = useState(false);
  const [replayText, setReplayText] = useState('> JOGAR NOVAMENTE');
  const [lobbyText, setLobbyText] = useState('> VOLTAR AO LOBBY');
  useEffect(() => {
    let timer;
    if (seconds > 0 && !gameOver && abandonState !== 'surrendered') {
      timer = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [seconds, gameOver, abandonState]);

  const handleCellClick = (index) => {
    if (board[index] || gameOver || abandonState === 'surrendered') return;

    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);

    if (currentTurn === 'X') {
      setCurrentTurn('O');
    } else {
      setCurrentTurn('X');
    }

    // Just simulating a win condition if X plays 3 times for demo purposes
    const xCount = newBoard.filter(c => c === 'X').length;
    if (xCount >= 3) {
      setTimeout(() => {
        setGameOver(true);
        // O Modal aparece automaticamente quando gameOver é true!
      }, 500); // pequeno delay dramático
    }
  };

  const handleAbandon = () => {
    setAbandonState('confirm');
  };

  const handleCancelAbandon = () => {
    setAbandonState('default');
  };

  const handleConfirmAbandon = () => {
    setAbandonState('surrendered');
    setGameOver(true);
  };

  const handleReplay = () => {
    setReplayText('> REINICIANDO...');
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setGameOver(false);
      setAbandonState('default');
      setCurrentTurn('X');
      setSeconds(14);
      setReplayText('> JOGAR NOVAMENTE');
    }, 800);
  };

  const handleLobby = () => {
    setLobbyText('> CARREGANDO LOBBY...');
    setTimeout(() => {
      navigate('/lobby');
    }, 800);
  };

  const renderTurnIndicator = () => {
    if (abandonState === 'surrendered') {
      return (
        <span className={`${styles.turnText} ${styles.textError}`}>
          &gt; PARTIDA ENCERRADA [DERROTA]
        </span>
      );
    }
    if (gameOver) {
      return (
        <span className={`${styles.turnText} ${styles.textPrimary}`}>
          &gt; ANALISANDO MATRIZ...
        </span>
      );
    }
    if (currentTurn === 'X') {
      return (
        <span className={`${styles.turnText} ${styles.textPrimary}`}>
          &gt; SEU TURNO [X]
        </span>
      );
    }
    return (
      <span className={`${styles.turnText} ${styles.textSecondary}`}>
        &gt; AGUARDANDO [O]
      </span>
    );
  };

  return (
    <Layout activePath="game" hideNav={true}>
      <div className={styles.container}>
        
        {/* Board 3x3 */}
        <div className={styles.boardWrapper}>
          <div className={styles.boardGrid}>
            {board.map((cell, idx) => (
              <button 
                key={idx}
                className={`${styles.boardCell} ${cell === 'X' ? styles.textPrimary : cell === 'O' ? styles.textSecondary : ''}`}
                onClick={() => handleCellClick(idx)}
              >
                <span>{cell}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Telemetry */}
        <div className={styles.topTelemetry}>
          <div className={styles.roomInfo}>
            <span>ROOM_ID: #0x9F4</span>
            <span id="match-timer">00:{seconds < 10 ? '0' : ''}{seconds}</span>
          </div>
          
          {/* Players Duel */}
          <div className={styles.duelRow}>
            <div className={styles.playerWrapper}>
              <span className={`${styles.playerDot} ${styles.bgPrimary}`}></span>
              <span className={`${styles.playerName} ${styles.textPrimary}`}>VOCÊ (X)</span>
            </div>
            <span className={styles.vsText}>VS</span>
            <div className={styles.playerWrapper}>
              <span className={`${styles.playerName} ${styles.textSecondary}`}>ENIO (O)</span>
              <span className={`${styles.playerDot} ${styles.bgSecondary}`}></span>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className={styles.turnIndicatorBox}>
          <div className={styles.turnInner}>
            {renderTurnIndicator()}
          </div>
        </div>
        
       
        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          {abandonState === 'default' && (
            <div className={styles.abandonDefault}>
              <button className={styles.btnAbandon} onClick={handleAbandon}>
                <span className={`material-symbols-outlined ${styles.flagIcon}`}>flag</span>
                [ ABANDONAR JOGO ]
              </button>
            </div>
          )}
          
          {abandonState === 'confirm' && (
            <div className={`${styles.abandonConfirm} animate-pulse`}>
              <div className={styles.confirmPrompt}>
                &gt; CONFIRMA RENDIÇÃO? DERROTA IMEDIATA.
              </div>
              <div className={styles.confirmActions}>
                <button className={styles.btnConfirmYes} onClick={handleConfirmAbandon}>
                  [ SIM, SAIR ]
                </button>
                <button className={styles.btnConfirmNo} onClick={handleCancelAbandon}>
                  [ CANCELAR ]
                </button>
              </div>
            </div>
          )}
          
          {abandonState === 'surrendered' && (
            <div className={styles.surrenderedBox}>
              [!] SESSÃO ABANDONADA
            </div>
          )}
        </div>
        
        {/* Modal Overlay */}
        {gameOver && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              
              {/* Glow Bar */}
              <div className={styles.glowBar}></div>
              
              {/* Header */}
              <div className={styles.modalHeader}>
                <span>┌── RESULTADO FINAL ──┐</span>
              </div>
              
              {/* Victory Banner */}
              <div className={styles.victoryBanner}>
                <div className={`${styles.victoryTitle} animate-pulse`}>
                  {abandonState === 'surrendered' ? '>>> DERROTA <<<' : '>>> VITORIA <<<'}
                </div>
                <div className={styles.victorySub}>
                  {abandonState === 'surrendered' ? 'VOCÊ ABANDONOU A PARTIDA' : 'VOCÊ VENCEU A RODADA!'}
                </div>
              </div>
              
              {/* Placar */}
              <div className={styles.placarBox}>
                <div className={styles.placarScore}>
                  {abandonState === 'surrendered' ? 'VOCÊ [ 0 ] x [ 1 ] RIVAL' : 'VOCÊ [ 1 ] x [ 0 ] RIVAL'}
                </div>
              </div>
              
              {/* Actions */}
              <div className={styles.actions}>
                <button className={styles.btnReplay} onClick={handleReplay}>
                  <span>{replayText}</span>
                </button>
                <button className={styles.btnLobby} onClick={handleLobby}>
                  <span>{lobbyText}</span>
                </button>
              </div>
              
            </div>
          </div>
        )}
        
      </div>
    </Layout>
  );
}
