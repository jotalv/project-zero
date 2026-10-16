import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

// Preferências ficam só neste aparelho (localStorage). O jogo Godot ainda
// não lê esses valores; quando tiver áudio, é daqui que eles devem vir.
const CHAVE_CONFIG = 'project-zero:config';
const CONFIG_PADRAO = { som: true, volume: 80, vibracao: true };

function carregarConfig() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_CONFIG));
    return { ...CONFIG_PADRAO, ...salvo };
  } catch {
    return CONFIG_PADRAO;
  }
}

function Configuracoes() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState(carregarConfig);
  const [telaCheia, setTelaCheia] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
    } catch {
      // sem localStorage (aba anônima etc.): a preferência vale só nesta visita
    }
  }, [config]);

  useEffect(() => {
    const aoMudar = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', aoMudar);
    return () => document.removeEventListener('fullscreenchange', aoMudar);
  }, []);

  const alternarTelaCheia = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.window}>
        <div style={styles.topBar}>
          <h1 style={styles.titulo}>CONFIGURAÇÕES</h1>
          <button type="button" onClick={() => navigate('/home')} style={styles.voltarButton}>
            VOLTAR
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.card}>
            <h2 style={styles.secao}>JOGO</h2>

            <div style={styles.linha}>
              <span style={styles.label}>SOM//</span>
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, som: !c.som }))}
                style={config.som ? styles.toggleOn : styles.toggleOff}
                aria-pressed={config.som}
              >
                {config.som ? 'LIGADO' : 'DESLIGADO'}
              </button>
            </div>

            <div style={styles.linha}>
              <label style={styles.label} htmlFor="volume">VOLUME//</label>
              <div style={styles.volume}>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="100"
                  value={config.volume}
                  disabled={!config.som}
                  onChange={(e) => setConfig((c) => ({ ...c, volume: Number(e.target.value) }))}
                  style={styles.slider}
                />
                <span style={styles.valor}>{config.volume}</span>
              </div>
            </div>

            <div style={styles.linha}>
              <span style={styles.label}>VIBRAÇÃO//</span>
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, vibracao: !c.vibracao }))}
                style={config.vibracao ? styles.toggleOn : styles.toggleOff}
                aria-pressed={config.vibracao}
              >
                {config.vibracao ? 'LIGADA' : 'DESLIGADA'}
              </button>
            </div>

            {document.fullscreenEnabled && (
              <div style={styles.linha}>
                <span style={styles.label}>TELA CHEIA//</span>
                <button
                  type="button"
                  onClick={alternarTelaCheia}
                  style={telaCheia ? styles.toggleOn : styles.toggleOff}
                  aria-pressed={telaCheia}
                >
                  {telaCheia ? 'LIGADA' : 'DESLIGADA'}
                </button>
              </div>
            )}

            <h2 style={{ ...styles.secao, marginTop: '28px' }}>CONTA</h2>

            <div style={styles.linha}>
              <span style={styles.label}>E-MAIL//</span>
              <span style={styles.valor}>{usuario.email}</span>
            </div>

            <div style={styles.acoes}>
              <button type="button" onClick={() => navigate('/personagem')} style={styles.acaoButton}>
                TROCAR SENHA
              </button>
              <button type="button" onClick={handleLogout} style={styles.sairButton}>
                SAIR DA CONTA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const toggleBase = {
  minWidth: '110px',
  padding: '6px 12px',
  border: '1px solid',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'var(--font-display)',
  fontWeight: 'bold',
  fontSize: '11px',
  backgroundColor: 'var(--neon-bg)',
};

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
    maxWidth: '520px',
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
    padding: '24px 20px 30px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '360px',
  },
  secao: {
    color: 'var(--neon-lime)',
    fontSize: '13px',
    letterSpacing: '2px',
    margin: '0 0 4px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 8px var(--neon-lime-glow)',
  },
  linha: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(53, 228, 255, 0.15)',
  },
  label: {
    color: 'var(--neon-cyan)',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontFamily: 'var(--font-display)',
  },
  valor: {
    color: 'var(--text-primary)',
    fontSize: '14px',
    overflowWrap: 'anywhere',
    textAlign: 'right',
  },
  volume: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  slider: {
    width: '120px',
    accentColor: 'var(--neon-cyan)',
  },
  toggleOn: {
    ...toggleBase,
    color: 'var(--neon-lime)',
    borderColor: 'var(--neon-lime)',
  },
  toggleOff: {
    ...toggleBase,
    color: 'var(--text-muted)',
    borderColor: 'var(--neon-frame)',
  },
  acoes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  acaoButton: {
    padding: '12px',
    background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-cyan))',
    color: '#0c0620',
    border: 'none',
    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  sairButton: {
    padding: '12px',
    backgroundColor: 'var(--neon-bg)',
    color: 'var(--neon-pink)',
    border: '1px solid var(--neon-pink)',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
};

export default Configuracoes;
