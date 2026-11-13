import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSystemMessage('ERRO: CREDENCIAIS INCOMPLETAS//');
      return;
    }
    setSystemMessage('AUTENTICANDO ACESSO...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-container">
      {/* Camada de linhas de CRT / Scanlines para o efeito retro-futurista */}
      <div className="crt-scanlines"></div>

      <div className="login-image-container">
        <img src="/tela-login.webp" alt="Terminal Login" className="login-frame-img" />
        
        <form onSubmit={handleLogin} className="login-form-overlay">
          
          {/* Mensagem de status do sistema ao vivo */}
          {systemMessage && (
            <div className="terminal-feedback">
              <span>{systemMessage}</span>
            </div>
          )}

          <div className="input-group user-group">
            <input 
              type="text" 
              placeholder="AGENTE.ID // EX: PHANTOM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div className="input-group password-group">
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div className="form-actions">
            <span 
              onClick={() => setSystemMessage('PROTOCOLO DE RECUPERAÇÃO INDISPONÍVEL NO SETOR 7')} 
              className="link-text"
            >
              [ ESQUECI A SENHA ]
            </span>
            
            <button type="submit" className="login-submit-btn">
              INICIALIZAR SESSÃO &gt;
            </button>
            
            <div className="register-redirect">
              <span onClick={() => navigate('/register')} className="link-text">
                &gt;&gt; NOVO NA REDE? CADASTRE-SE
              </span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;