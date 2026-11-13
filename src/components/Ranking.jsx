import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

export function Ranking() {
  const navigate = useNavigate();

  // Dados dos principais agentes sem a propriedade de status
  const topAgents = [
    { rank: '01', name: 'LulaDroid', score: '98450' },
    { rank: '02', name: 'Joao Careca', score: '87200' },
    { rank: '03', name: 'Danilo Femboy', score: '76100' },
    { rank: '04', name: 'Bolsotron', score: '65400' },
    { rank: '05', name: 'Arroz cadele', score: '54300' },
  ];

  return (
    <div className="ranking-container">
      <div className="crt-scanlines"></div>

      <div className="ranking-hud-panel">
        <div className="ranking-header">
          <h2>// CLASSIFICAÇÃO GLOBAL DE AGENTES</h2>
          <span className="sub-header">SETOR DE SEGURANÇA // TOP 5 REGISTOS</span>
        </div>

        <div className="ranking-table-wrapper">
          {/* Cabeçalho ajustado para 3 colunas */}
          <div className="table-header-row">
            <span>RANK//</span>
            <span>AGENTE//</span>
            <span>PONTUAÇÃO//</span>
          </div>

          <div className="table-body">
            {topAgents.map((agent, index) => (
              <div key={index} className={`ranking-row rank-${agent.rank}`}>
                <span className="col-rank">#{agent.rank}</span>
                <span className="col-name">{agent.name}</span>
                <span className="col-score">{agent.score} PTS</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ranking-footer">
          <button onClick={() => navigate('/')} className="back-btn">
            &lt; RETORNAR AO MENU PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ranking;