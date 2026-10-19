import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import styles from './MatchPage.module.css';

const formatName = (name) => {
  if (!name) return '';
  return name.length > 10 ? `${name.slice(0, 10)}...` : name;
};

export function MatchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    match,
    board,
    currentTurn,
    mySymbol,
    opponent,
    isMyTurn,
    status,
    winner,
    myScore,
    opponentScore,
    rematchState,
    rematchRequester,
    makeMove,
    surrender,
    requestRematch,
    acceptRematch,
    leaveMatch
  } = useGame();

  const [abandonState, setAbandonState] = useState('default'); // 'default', 'confirm', 'surrendered'

  // Se não houver partida ativa, redireciona ao lobby
  useEffect(() => {
    if (!match) {
      navigate('/lobby');
    }
  }, [match, navigate]);

  const handleCellClick = (index) => {
    if (board[index] || status === 'finished' || status === 'draw') return;
    if (match?.players?.length >= 2 && !isMyTurn) return;

    makeMove(index);
  };

  const handleAbandon = () => {
    setAbandonState('confirm');
  };

  const handleCancelAbandon = () => {
    setAbandonState('default');
  };

  const handleConfirmAbandon = () => {
    setAbandonState('surrendered');
    surrender();
  };

  const handleReplayClick = () => {
    setAbandonState('default');
    requestRematch();
  };

  const handleAcceptRematch = () => {
    setAbandonState('default');
    acceptRematch();
  };

  const handleLobby = () => {
    leaveMatch();
    navigate('/lobby');
  };

  const isGameOver = status === 'finished' || status === 'draw' || abandonState === 'surrendered';
  const isWon = winner === mySymbol && abandonState !== 'surrendered';
  const isDraw = winner === 'DRAW';

  const renderTurnIndicator = () => {
    if (abandonState === 'surrendered') {
      return (
        <span className={`${styles.turnText} ${styles.textError}`}>
          &gt; PARTIDA ENCERRADA [DERROTA]
        </span>
      );
    }
    if (status === 'waiting') {
      return (
        <span className={`${styles.turnText} ${styles.textSecondary}`}>
          &gt; AGUARDANDO OPONENTE ENTRAR NA SALA...
        </span>
      );
    }
    if (isGameOver) {
      return (
        <span className={`${styles.turnText} ${styles.textPrimary}`}>
          &gt; PARTIDA FINALIZADA
        </span>
      );
    }
    if (isMyTurn) {
      return (
        <span className={`${styles.turnText} ${styles.textPrimary}`}>
          &gt; SEU TURNO [{mySymbol}]
        </span>
      );
    }
    return (
      <span className={`${styles.turnText} ${styles.textSecondary}`}>
        &gt; TURNO DO OPONENTE [{mySymbol === 'X' ? 'O' : 'X'}]
      </span>
    );
  };

  return (
    <Layout activePath="game" hideNav={true}>
      <div className={styles.container}>
        
        {/* Tabuleiro 3x3 */}
        <div className={styles.boardWrapper}>
          <div className={styles.boardGrid}>
            {board.map((cell, idx) => (
              <button 
                key={idx}
                type="button"
                className={`${styles.boardCell} ${
                  cell === 'X' ? styles.textPrimary : cell === 'O' ? styles.textSecondary : ''
                }`}
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(cell) || isGameOver || (match?.players?.length >= 2 && !isMyTurn)}
              >
                <span>{cell}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetria do topo */}
        <div className={styles.topTelemetry}>
          <div className={styles.roomInfo}>
            <span>SALA: #{match?.id || 'LOCAL'}</span>
            <span>MODO: 3X3</span>
          </div>
          
          {/* Duelo de Jogadores com Placar abaixo do nome */}
          <div className={styles.duelRow}>
            {/* Jogador 1 (Você) */}
            <div className={styles.playerColumn}>
              <div className={styles.playerHeader}>
                <span className={`${styles.playerDot} ${styles.bgPrimary}`}></span>
                <span 
                  className={`${styles.playerName} ${styles.textPrimary}`}
                  title={user?.username || 'VOCÊ'}
                >
                  {formatName(user?.username || 'VOCÊ')} ({mySymbol})
                </span>
              </div>
              <span className={styles.playerScore}>
                PLACAR: [ {myScore} ]
              </span>
            </div>

            <span className={styles.vsText}>VS</span>

            {/* Jogador 2 (Oponente) */}
            <div className={`${styles.playerColumn} ${styles.playerColumnRight}`}>
              <div className={styles.playerHeader}>
                <span 
                  className={`${styles.playerName} ${styles.textSecondary}`}
                  title={opponent?.username || 'AGUARDANDO...'}
                >
                  {formatName(opponent ? opponent.username : 'AGUARDANDO...')} ({opponent ? opponent.symbol : (mySymbol === 'X' ? 'O' : 'X')})
                </span>
                <span className={`${styles.playerDot} ${styles.bgSecondary}`}></span>
              </div>
              <span className={styles.playerScore}>
                PLACAR: [ {opponentScore} ]
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de Turno */}
        <div className={styles.turnIndicatorBox}>
          <div className={styles.turnInner}>
            {renderTurnIndicator()}
          </div>
        </div>
        
        {/* Ações inferiores */}
        <div className={styles.bottomActions}>
          {abandonState === 'default' && !isGameOver && (
            <div className={styles.abandonDefault}>
              <button className={styles.btnAbandon} type="button" onClick={handleAbandon}>
                <span className={`material-symbols-outlined ${styles.flagIcon}`}>flag</span>
                [ ABANDONAR JOGO ]
              </button>
            </div>
          )}
          
          {abandonState === 'confirm' && (
            <div className={`${styles.abandonConfirm} animate-pulse`}>
              <div className={styles.confirmPrompt}>
                &gt; DESEJA REALMENTE ABANDONAR A PARTIDA?
              </div>
              <div className={styles.confirmActions}>
                <button className={styles.btnConfirmYes} type="button" onClick={handleConfirmAbandon}>
                  [ SIM, SAIR ]
                </button>
                <button className={styles.btnConfirmNo} type="button" onClick={handleCancelAbandon}>
                  [ CANCELAR ]
                </button>
              </div>
            </div>
          )}
          
          {abandonState === 'surrendered' && (
            <div className={styles.surrenderedBox}>
              [!] VOCÊ SE RENDEU
            </div>
          )}
        </div>
        
        {/* Modal de Fim de Jogo e Revanche */}
        {isGameOver && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              
              <div className={styles.glowBar}></div>
              
              <div className={styles.modalHeader}>
                <span>
                  {rematchState === 'requested' 
                    ? '┌── DESAFIO DISPONÍVEL ──┐' 
                    : '┌── RESULTADO FINAL ──┐'}
                </span>
              </div>
              
              {/* Se o oponente pediu revanche, mostra o banner de novo desafio */}
              {rematchState === 'requested' ? (
                <div className={styles.victoryBanner}>
                  <div className={`${styles.victoryTitle} animate-pulse`} style={{ color: '#00ff66' }}>
                    &gt;&gt;&gt; NOVO DESAFIO &lt;&lt;&lt;
                  </div>
                  <div className={styles.victorySub}>
                    {formatName(rematchRequester?.username || opponent?.username || 'O OPONENTE')} DESAFIOU NOVAMENTE!
                  </div>
                </div>
              ) : rematchState === 'pending' ? (
                <div className={styles.victoryBanner}>
                  <div className={`${styles.victoryTitle} animate-pulse`}>
                    {isDraw ? '>>> EMPATE <<<' : isWon ? '>>> VITÓRIA <<<' : '>>> DERROTA <<<'}
                  </div>
                  <div className={styles.victorySub} style={{ color: '#00e5ff' }}>
                    DESAFIO ENVIADO... AGUARDANDO OPONENTE ACEITAR!
                  </div>
                </div>
              ) : (
                <div className={styles.victoryBanner}>
                  <div className={`${styles.victoryTitle} animate-pulse`}>
                    {isDraw 
                      ? '>>> EMPATE <<<' 
                      : isWon 
                        ? '>>> VITÓRIA <<<' 
                        : '>>> DERROTA <<<'}
                  </div>
                  <div className={styles.victorySub}>
                    {isDraw
                      ? 'NENHUM JOGADOR VENCEU ESTA RODADA'
                      : isWon
                        ? 'PARABÉNS, VOCÊ VENCEU A RODADA!'
                        : abandonState === 'surrendered'
                          ? 'VOCÊ ABANDONOU A PARTIDA'
                          : 'SEU OPONENTE VENCEU A RODADA'}
                  </div>
                </div>
              )}
              
              {/* Placar Acumulado Salvo no Banco Estruturado em Colunas */}
              <div className={styles.modalScoreCard}>
                <span className={styles.modalScoreTitle}>PLACAR DA PARTIDA</span>
                <div className={styles.modalScoreRow}>
                  <div className={styles.modalPlayerScore}>
                    <span className={styles.modalScoreName}>
                      {formatName(user?.username || 'VOCÊ')} ({mySymbol})
                    </span>
                    <span className={styles.modalScoreDigit}>{myScore}</span>
                  </div>
                  <span className={styles.modalScoreVs}>X</span>
                  <div className={`${styles.modalPlayerScore} ${styles.modalPlayerScoreRight}`}>
                    <span className={styles.modalScoreName}>
                      {formatName(opponent?.username || 'OPONENTE')} ({opponent ? opponent.symbol : (mySymbol === 'X' ? 'O' : 'X')})
                    </span>
                    <span className={styles.modalScoreDigit}>{opponentScore}</span>
                  </div>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className={styles.actions}>
                {rematchState === 'requested' ? (
                  <>
                    <button 
                      className={styles.btnAcceptChallenge} 
                      type="button" 
                      onClick={handleAcceptRematch}
                    >
                      <span>&gt; [ ACEITAR DESAFIO ]</span>
                    </button>
                    <button className={styles.btnLobby} type="button" onClick={handleLobby}>
                      <span>&gt; VOLTAR AO LOBBY</span>
                    </button>
                  </>
                ) : rematchState === 'pending' ? (
                  <>
                    <button 
                      className={styles.btnReplay} 
                      type="button" 
                      disabled 
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    >
                      <span>&gt; AGUARDANDO OPONENTE...</span>
                    </button>
                    <button className={styles.btnLobby} type="button" onClick={handleLobby}>
                      <span>&gt; VOLTAR AO LOBBY</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.btnReplay} type="button" onClick={handleReplayClick}>
                      <span>&gt; JOGAR NOVAMENTE</span>
                    </button>
                    <button className={styles.btnLobby} type="button" onClick={handleLobby}>
                      <span>&gt; VOLTAR AO LOBBY</span>
                    </button>
                  </>
                )}
              </div>
              
            </div>
          </div>
        )}
        
      </div>
    </Layout>
  );
}

export default MatchPage;
