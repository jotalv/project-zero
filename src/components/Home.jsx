import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Camadas visuais imersivas compartilhadas */}
      <div className="crt-scanlines"></div>
      <div className="cyber-grid-bg"></div>

      <div className="home-hud-panel">
        {/* Barra de log estilo terminal militar */}
        <div className="terminal-top-bar">
          <span className="blink-dot">●</span> SYSTEM_TERMINAL_PROJECT_ZERO
        </div>

        <div className="home-header">
          <h1>PROJECT  ZERO</h1>
          <p className="sub-header">&gt;&gt; SELECIONE UM DOS ABAIXO</p>
        </div>

        <div className="menu-options">
          <button onClick={() => navigate('/login')} className="cyber-btn primary">
            <span className="btn-prefix">&gt;</span> INICIAR JOGO (LOGIN)
          </button>
          
          <button onClick={() => navigate('/ranking')} className="cyber-btn">
            <span className="btn-prefix">&gt;</span> RANKING
          </button>
          
          <button onClick={() => alert('Módulo de configurações offline no setor atual.')} className="cyber-btn">
            <span className="btn-prefix">&gt;</span> CONFIGURAÇÕES
          </button>
        </div>

        <div className="terminal-footer">
          <span>STATUS: ENCRYPTED // SECURE_CHANNEL: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

export default Home;