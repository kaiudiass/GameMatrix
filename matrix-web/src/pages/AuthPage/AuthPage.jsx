import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout/Layout';
import styles from './AuthPage.module.css';

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('// MODO: AUTENTICAÇÃO');
  const [feedbackType, setFeedbackType] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setPassword('');
    setConfirmPassword('');
    if (newMode === 'login') {
      setFeedback('// MODO: LOGIN');
      setFeedbackType('login');
    } else {
      setFeedback('// MODO: NOVO REGISTRO');
      setFeedbackType('register');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (mode === 'register' && password !== confirmPassword) {
      setFeedback('// ERRO: AS SENHAS NÃO COINCIDEM');
      setFeedbackType('error');
      return;
    }

    setIsSubmitting(true);
    setFeedback('// PROCESSANDO...');
    setFeedbackType('processing');

    try {
      if (mode === 'login') {
        await login(username, password);
        setFeedback(`// BEM-VINDO, ${username.toUpperCase()} [SUCESSO]`);
        setFeedbackType('login-success');
      } else {
        await register(username, password);
        setFeedback('// CONTA CRIADA COM SUCESSO');
        setFeedbackType('register-success');
      }

      setTimeout(() => {
        navigate('/lobby');
      }, 700);
    } catch (err) {
      const errorMsg =
        err.errors && err.errors.length > 0
          ? err.errors.map((e) => e.message).join(' | ')
          : err.message || 'FALHA NA REQUISIÇÃO';

      setFeedback(`// ERRO: ${errorMsg.toUpperCase()}`);
      setFeedbackType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className={styles.container}>
        <div className={styles.statusLog}></div>
        
        <div className={styles.terminalBox}>
          <div className={styles.headerArea}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                <span className={styles.titleHighlight}>LOGIN</span>
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
              type="button"
            >
              [ LOGIN ]
            </button>
            <button 
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : styles.tabInactive}`}
              onClick={() => handleModeSwitch('register')}
              type="button"
            >
              [ REGISTRO ]
            </button>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username-input">
                <span>&gt; USUÁRIO</span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  id="username-input"
                  className={styles.input}
                  placeholder="Seu nome de usuário"
                  required
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password-input">
                <span>&gt; SENHA</span>
                <span className={`${styles.cursorBlock} ${styles.cursorBlockDim}`}></span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  id="password-input"
                  className={styles.input}
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
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
                  <span>&gt; CONFIRMAR SENHA</span>
                  <span className={`${styles.cursorBlock} ${styles.cursorBlockDim}`}></span>
                </label>
                <div className={styles.inputWrapper}>
                  <input 
                    id="confirm-password-input"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
            
            <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
              <span>&gt; [ {isSubmitting ? 'AGUARDE...' : mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'} ]</span>
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

export default AuthPage;
