import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

export function Ranking() {
  const navigate = useNavigate();

  // Dados simulados (placeholders) no estilo do sistema
  const [rankingData, setRankingData] = useState([
    { id: 1, nome: 'Sahur', pontos: 2450 },
    { id: 2, nome: 'Jota', pontos: 2120 },
    { id: 3, nome: 'Bolsotron', pontos: 1890 },
    { id: 4, nome: 'Donald Trump', pontos: 1340 },
    { id: 5, nome: 'Danilo', pontos: 950 },
  ]);

  // Ordena os jogadores automaticamente do maior para o menor ponto
  const sortedRanking = [...rankingData].sort((a, b) => b.pontos - a.pontos);

  return (
    <div className="ranking-container">
      <div className="ranking-terminal-box">
        {/* Banner Superior Estilo Tech */}
        <div className="ranking-header-banner">
          <h2>RANKING//</h2>
          <span className="ranking-subtitle">[ TOP AGENTES DO SISTEMA ]</span>
        </div>

        {/* Lista de Jogadores */}
        <div className="ranking-list">
          {sortedRanking.map((player, index) => (
            <div key={player.id} className={`ranking-item pos-${index + 1}`}>
              <div className="player-info">
                <span className="pos">0{index + 1}//</span>
                <span className="name">{player.nome}</span>
              </div>
              <span className="points">{player.pontos} PTS</span>
            </div>
          ))}
        </div>

        {/* Botão de Voltar com gradiente do jogo */}
        <button className="cyber-back-btn" onClick={() => navigate('/')}>
          &lt; VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
}

export default Ranking;