// se voce esta lendo isso é por que ficou curioso né?
// por enqaunto eu só foquei em fazer uma parte visual simples ok nada muito complexo .

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/', { replace: true });
  };
  return (
    <div style={styles.container}>
      {/* Estrutura principal do Site/Jogo */}
      <div style={styles.window}>
        
        {/* Barra Superior Horizontal: Dados do Jogador + Botão Logout */}
        <div style={styles.topBar}>
          <div style={styles.playerInfo}>
            <span><strong style={styles.label}>NOME:</strong> Jogador</span>
            <span><strong style={styles.label}>LV:</strong> 1</span>
            <span><strong style={styles.label}>CLASSE:</strong> Humano</span>
          </div>

          <button onClick={onLogout} style={styles.logoutButton}>
            LOGOUT
          </button>
        </div>

        {/* Conteúdo Central */}
        <div style={styles.content}>
          {/* Quadro Central */}
          <div style={styles.mainPanel}>
            {/* Caixa/Botão de Missões */}
            <div style={styles.missionCard}>
              <h2 style={styles.missionTitle}>MISSÕES</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Estilos neutros em formato retangular seguindo o esboço no papel
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Fundo principal escuro
    fontFamily: "'Courier New', Courier, monospace",
    padding: '20px',
    boxSizing: 'border-box',
  },
  window: {
    backgroundColor: '#1e293b', // Fundo da tela do jogo
    border: '1px solid #475569',
    width: '100%',
    maxWidth: '850px', // Largura maior para caber as informações no topo
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '0px',
  },
  topBar: {
    backgroundColor: '#334155', // Barrinha superior
    padding: '12px 20px',
    borderBottom: '1px solid #475569',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  playerInfo: {
    display: 'flex',
    gap: '20px',
    color: '#f8fafc',
    fontSize: '14px',
  },
  label: {
    color: '#94a3b8',
    marginRight: '4px',
  },
  logoutButton: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #475569',
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: 'bold',
    fontSize: '12px',
  },
  content: {
    flex: 1,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPanel: {
    backgroundColor: '#0f172a', // Retângulo grande central
    border: '1px solid #334155',
    width: '100%',
    maxWidth: '520px',
    height: '280px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  missionCard: {
    backgroundColor: '#1e293b', // Retângulo menor de Missões
    border: '1px solid #475569',
    width: '75%',
    height: '110px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  missionTitle: {
    color: '#f8fafc',
    margin: 0,
    fontSize: '22px',
    letterSpacing: '3px',
  },
};

export default Dashboard;