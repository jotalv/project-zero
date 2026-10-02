import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { MISSOES } from '../../data/quests';

function World() {
  const navigate = useNavigate();
  const { iniciarBatalha } = useGame();

  const handleIniciar = (missao) => {
    iniciarBatalha(missao.inimigoId);
    navigate('/batalha');
  };

  return (
    <div style={styles.container}>
      <div style={styles.window}>
        <div style={styles.topBar}>
          <h1 style={styles.titulo}>MUNDO CYBER</h1>
          <button type="button" onClick={() => navigate('/home')} style={styles.voltarButton}>
            VOLTAR
          </button>
        </div>

        <div style={styles.content}>
          {MISSOES.map((missao) => (
            <button
              key={missao.id}
              type="button"
              className="menu-card"
              style={styles.missaoCard}
              onClick={() => handleIniciar(missao)}
            >
              <h2 style={styles.missaoNome}>{missao.nome}</h2>
              <p style={styles.missaoDescricao}>{missao.descricao}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'radial-gradient(circle at 50% 20%, #2a1552 0%, var(--neon-bg) 65%)',
    fontFamily: 'var(--font-mono)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  window: {
    backgroundColor: 'var(--neon-panel)',
    border: '2px solid var(--neon-frame)',
    boxShadow: '0 0 10px rgba(74, 31, 143, 0.8), 0 0 40px rgba(53, 228, 255, 0.12)',
    width: '100%',
    maxWidth: '600px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '6px',
  },
  topBar: {
    backgroundColor: 'rgba(53, 228, 255, 0.06)',
    padding: '12px 20px',
    borderBottom: '2px solid var(--neon-frame)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '4px 4px 0 0',
  },
  titulo: {
    color: 'var(--neon-cyan)',
    margin: 0,
    fontSize: '18px',
    letterSpacing: '3px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 8px var(--neon-cyan-glow)',
  },
  voltarButton: {
    backgroundColor: 'var(--neon-bg)',
    color: 'var(--neon-pink)',
    border: '1px solid var(--neon-pink)',
    borderRadius: '4px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 'bold',
    fontSize: '11px',
  },
  content: {
    flex: 1,
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  missaoCard: {
    backgroundColor: 'var(--neon-bg)',
    border: '1px solid var(--neon-cyan)',
    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    padding: '18px 24px',
    textAlign: 'left',
    cursor: 'pointer',
  },
  missaoNome: {
    color: 'var(--neon-cyan)',
    margin: '0 0 6px',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 8px var(--neon-cyan-glow)',
  },
  missaoDescricao: {
    color: 'var(--text-primary)',
    margin: 0,
    fontSize: '13px',
  },
};

export default World;
