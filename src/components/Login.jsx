import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSystemMessage('ERRO: CREDENCIAIS INCOMPLETAS//');
      return;
    }

    setSystemMessage('CONECTANDO AO SERVIDOR...');

    try {
      // TODO: O responsável pelo banco de dados deve encaixar a chamada de login aqui
      // Exemplo:
      // const response = await fetch('URL_DO_BACKEND/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // if (!response.ok) throw new Error('Credenciais inválidas');
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      // navigate('/dashboard');

      setSystemMessage('AGUARDANDO INTEGRAÇÃO COM BANCO DE DADOS//');
    } catch (error) {
      setSystemMessage('ACESSO NEGADO: CREDENCIAIS INVÁLIDAS//');
    }
  };

  return (
    <div className="login-container">
      <div className="crt-scanlines"></div>

      <div className="login-image-container">
        <img src="/tela-login.webp" alt="Terminal Login" className="login-frame-img" />
        
        <form onSubmit={handleLogin} className="login-form-overlay">
          
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