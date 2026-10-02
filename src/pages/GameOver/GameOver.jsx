import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

function GameOver() {
  const navigate = useNavigate();
  const { resetarBatalha } = useGame();

  const handleVoltar = () => {
    resetarBatalha();
    navigate('/mundo', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.painel}>
        <h1 style={styles.titulo}>VOCÊ FOI DERROTADO</h1>
        <p style={styles.subtitulo}>O vírus foi mais forte dessa vez.</p>
        <button type="button" className="neon-button" onClick={handleVoltar}>
          VOLTAR AO MUNDO
        </button>
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
  painel: {
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  titulo: {
    color: 'var(--neon-pink)',
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    letterSpacing: '2px',
    textShadow: '0 0 10px var(--neon-pink-glow)',
    margin: 0,
  },
  subtitulo: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    margin: 0,
  },
};

export default GameOver;
