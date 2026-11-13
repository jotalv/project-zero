import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-cyber-card">
        {/* Logótipo / Título do Jogo */}
        <div className="logo-container">
          <h1 className="game-title">PROJECT ZERO</h1>
          <span className="game-subtitle"></span>
        </div>

        {/* Botões do Menu */}
        <div className="menu-buttons">
          <button 
            className="cyber-btn primary-btn"
            onClick={() => navigate('/login')}
          >
            JOGAR &gt;
          </button>

          <button 
            className="cyber-btn secondary-btn"
            onClick={() => navigate('/ranking')}
          >
            RANKING &gt;
          </button>

          <button 
            className="cyber-btn secondary-btn"
            onClick={() => alert('Configurações em breve!')}
          >
            CONFIGURAÇÕES &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;