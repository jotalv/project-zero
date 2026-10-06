import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        {/* Logótipo / Título do Jogo */}
        <div className="logo-container">
          <h1 className="game-title">PROJECT ZERO</h1>
        </div>

        {/* Botões do Menu */}
        <div className="menu-buttons">
          <button 
            className="menu-btn primary-btn"
            onClick={() => navigate('/login')}
          >
            JOGAR
          </button>

          <button 
            className="menu-btn secondary-btn"
            onClick={() => alert('Configurações em breve!')}
          >
            CONFIGURAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;