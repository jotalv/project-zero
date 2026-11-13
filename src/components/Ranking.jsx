import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

export function Ranking() {
  const navigate = useNavigate();

  
  const [rankingData, setRankingData] = useState([
    { id: 1, nome: 'Games Eduuu', pontos: 2450 },
    { id: 2, nome: 'Mulheres palhaço', pontos: 2120 },
    { id: 3, nome: 'Lula', pontos: 1890 },
    { id: 4, nome: 'Jair Inacio da Lula Bolsonaro', pontos: 1340 },
    { id: 5, nome: 'Jão V', pontos: 67000 },
  ]);

  // Ordena os jogadores 
  const sortedRanking = [...rankingData].sort((a, b) => b.pontos - a.pontos);

  return (
    <div className="ranking-container">
      <div className="ranking-card">
        <h2> RANKING GLOBAL</h2>
        <p className="ranking-subtitle">Os Goats</p>

        <div className="ranking-list">
          {sortedRanking.map((player, index) => (
            <div key={player.id} className={`ranking-item pos-${index + 1}`}>
              <span className="pos">#{index + 1}</span>
              <span className="name">{player.nome}</span>
              <span className="points">{player.pontos} pts</span>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}

export default Ranking;