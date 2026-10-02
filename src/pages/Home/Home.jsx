import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import bordaGame from '../../assets/home/borda-game.png';
import enterWorldImg from '../../assets/home/enter-world.png';
import enterWorldHoverImg from '../../assets/home/enter-world-hover.png';

const OPCOES_MENU = [
  { chave: 'missoes', titulo: 'MISSÕES', disponivel: false },
  { chave: 'personagem', titulo: 'PERSONAGEM', disponivel: true, rota: '/personagem' },
  { chave: 'config', titulo: 'CONFIGURAÇÕES', disponivel: false },
];

function Home() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let ativo = true;

    supabase
      .from('profiles')
      .select('nome, nivel, classe')
      .eq('id', usuario.id)
      .single()
      .then(({ data }) => {
        if (ativo) setPerfil(data);
      });

    return () => {
      ativo = false;
    };
  }, [usuario.id]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={styles.container}>
      <img src={bordaGame} alt="" className="game-border-overlay" />

      <div style={styles.window}>
        <div style={styles.topBar}>
          <div style={styles.playerInfo}>
            <span><strong style={styles.label}>NOME//</strong> {perfil?.nome ?? usuario.email}</span>
            <span><strong style={styles.label}>LV//</strong> {perfil?.nivel ?? 1}</span>
            <span><strong style={styles.label}>CLASSE//</strong> {perfil?.classe ?? 'Humano'}</span>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            LOGOUT
          </button>
        </div>

        <div style={styles.content}>
          <h1 style={styles.logo}>PROJECT ZERO</h1>

          <div style={styles.enterWorldWrap}>
            <button type="button" className="art-button" disabled style={{ cursor: 'not-allowed', opacity: 0.85 }}>
              <img src={enterWorldImg} alt="Entrar no mundo cyber" className="default-img" />
              <img src={enterWorldHoverImg} alt="" className="hover-img" />
            </button>
            <p style={styles.emBreveEnterWorld}>EM BREVE</p>
          </div>

          <div style={styles.menu}>
            {OPCOES_MENU.map((opcao) => (
              <button
                key={opcao.chave}
                type="button"
                className="menu-card"
                style={{
                  ...styles.menuItem,
                  ...(opcao.disponivel ? {} : styles.menuItemDesabilitado),
                }}
                disabled={!opcao.disponivel}
                onClick={opcao.disponivel ? () => navigate(opcao.rota) : undefined}
              >
                {opcao.titulo}
                {!opcao.disponivel && <span style={styles.emBreve}>EM BREVE</span>}
              </button>
            ))}
          </div>
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
    maxWidth: '850px',
    minHeight: '500px',
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
    flexWrap: 'wrap',
    gap: '10px',
    borderRadius: '4px 4px 0 0',
  },
  playerInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    color: 'var(--text-primary)',
    fontSize: '13px',
  },
  label: {
    color: 'var(--neon-cyan)',
    marginRight: '4px',
    fontFamily: 'var(--font-display)',
  },
  logoutButton: {
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
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '36px',
  },
  logo: {
    color: 'var(--neon-cyan)',
    margin: 0,
    fontSize: '32px',
    letterSpacing: '6px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 12px var(--neon-cyan-glow)',
  },
  enterWorldWrap: {
    width: '100%',
    maxWidth: '420px',
  },
  emBreveEnterWorld: {
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: '10px',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
  },
  menu: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '520px',
  },
  menuItem: {
    position: 'relative',
    backgroundColor: 'var(--neon-bg)',
    border: '1px solid var(--neon-cyan)',
    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    color: 'var(--neon-cyan)',
    padding: '24px 22px',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    textShadow: '0 0 8px var(--neon-cyan-glow)',
  },
  menuItemDesabilitado: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  emBreve: {
    display: 'block',
    marginTop: '8px',
    fontSize: '9px',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    textShadow: 'none',
    fontFamily: 'var(--font-mono)',
  },
};

export default Home;
