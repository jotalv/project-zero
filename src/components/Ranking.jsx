import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

export function Ranking() {
  const navigate = useNavigate();
  
  //aguardando os dados reais do banco
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // O responsável pelo banco dos dados la deve substituir isso pela requisição real
    const fetchRanking = async () => {
      try {
       
        
        setRankingData([]); // Mantém vazio até conectar
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="ranking-container">
      <div className="crt-scanlines"></div>
      <div className="cyber-grid-bg"></div>

      <div className="ranking-hud-panel">
        <div className="terminal-top-bar">
          <span className="blink-dot">●</span> HOST: PROJECT_ZERO_RANKING
        </div>

        <div className="ranking-header">
          <h2>// REGISTOS GLOBAIS</h2>
          <span className="sub-header">TOP AGENTES DA REDE</span>
        </div>

        <div className="ranking-table-wrapper">
          <div className="table-header-row">
            <span>RANK//</span>
            <span>ID//</span>
            <span>PONTUAÇÃO//</span>
          </div>

          <div className="table-body">
            {loading ? (
              <div className="ranking-row" style={{ gridColumn: '1 / -1', justifyContent: 'center', color: '#00f0ff' }}>
                CARREGANDO REGISTOS DO SERVIDOR...
              </div>
            ) : rankingData.length === 0 ? (
              <div className="ranking-row" style={{ gridColumn: '1 / -1', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                NENHUM REGISTO ENCONTRADO NA BASE DE DADOS.
              </div>
            ) : (
              rankingData.map((agent, index) => (
                <div 
                  key={agent.id || index} 
                  className={`ranking-row ${index === 0 ? 'elite-top-agent' : ''}`}
                >
                  <span className="col-rank">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="col-id">{agent.id || 'N/A'}</span>
                  <span className="col-name">{agent.name}</span>
                  <span className="col-clearance">{agent.clearance || 'USER'}</span>
                  <span className="col-score">{agent.score} PTS</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ranking-footer">
          <button onClick={() => navigate('/')} className="back-btn">
            &lt; VOLTAR AO MENU
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ranking;