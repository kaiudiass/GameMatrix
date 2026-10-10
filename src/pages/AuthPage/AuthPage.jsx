import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import styles from './AuthPage.module.css';

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('// MODO: VALIDAÇÃO DE CREDENCIAIS');
  const [feedbackType, setFeedbackType] = useState('login'); // 'login', 'register', 'processing'
  const [username, setUsername] = useState('');
  
  const navigate = useNavigate();

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'login') {
      setFeedback('// MODO: VALIDAÇÃO DE CREDENCIAIS');
      setFeedbackType('login');
    } else {
      setFeedback('// MODO: NOVO REGISTRO DE USUÁRIO');
      setFeedbackType('register');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback('// PROCESSANDO TRANSMISSÃO...');
    setFeedbackType('processing');

    setTimeout(() => {
      if (mode === 'login') {
        setFeedback(`// BEM-VINDO DE VOLTA, ${username || 'OPERADOR'} [ACESSO CONCEDIDO]`);
        setFeedbackType('login-success');
      } else {
        setFeedback('// REGISTRO CONCLUÍDO COM SUCESSO [ONLINE]');
        setFeedbackType('register-success');
      }
      
      setTimeout(() => {
        navigate('/lobby');
      }, 1000);
    }, 800);
  };

  return (
    <Layout showHeader={false}>
      <div className={styles.container}>
        <div className={styles.statusLog}></div>
        
        <div className={styles.terminalBox}>
          <div className={styles.headerArea}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                <span className={styles.titleHighlight}>SYS_LOGIN</span>
                <span className={styles.titleSeparator}>//</span>
                <span className={styles.titleAccess}>ACESSO</span>
              </h1>
              <span className={`material-symbols-outlined ${styles.lockIcon} animate-pulse`}>lock</span>
            </div>
          </div>
          
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : styles.tabInactive}`}
              onClick={() => handleModeSwitch('login')}
            >
              [ LOGIN ]
            </button>
            <button 
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : styles.tabInactive}`}
              onClick={() => handleModeSwitch('register')}
            >
              [ REGISTRO ]
            </button>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username-input">
                <span>&gt; USERNAME</span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  id="username-input"
                  className={styles.input}
                  placeholder="OPERADOR_ID"
                  required
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password-input">
                <span>&gt; PASSWORD</span>
                <span className={`${styles.cursorBlock} ${styles.cursorBlockDim}`}></span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  id="password-input"
                  className={styles.input}
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button 
                  type="button" 
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {mode === 'register' && (
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="confirm-password-input">
                  <span>&gt; CONFIRMAR_SENHA</span>
                  <span className={`${styles.cursorBlock} ${styles.cursorBlockDim}`}></span>
                </label>
                <div className={styles.inputWrapper}>
                  <input 
                    id="confirm-password-input"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>
            )}
            
            <button className={styles.submitBtn} type="submit">
              <span>&gt; [ {mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'} ]</span>
            </button>
          </form>
          
          <div className={`${styles.feedback} ${styles['feedback-' + feedbackType]}`}>
            {feedback}
          </div>
        </div>
      </div>
    </Layout>
  );
}
