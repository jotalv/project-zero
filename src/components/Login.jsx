import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        {/* Imagem carregada diretamente da pasta public */}
        <img src="/tela-login.webp" alt="Moldura Login" className="login-frame-img" />
        
        <form onSubmit={handleLogin} className="login-form-overlay">
          
          <div className="input-group user-group">
            <input 
              type="text" 
              placeholder="agente@antivirus.net" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div className="input-group password-group">
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
            />
          </div>

          <div className="form-actions">
            <span onClick={() => alert('Recuperação em breve!')} className="link-text">
              ESQUECI A SENHA
            </span>
            
            <button type="submit" className="login-submit-btn">
              ENTRAR
            </button>
            
            <div className="register-redirect">
              <span onClick={() => navigate('/register')} className="link-text">
                Não tem conta? Cadastre-se
              </span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;