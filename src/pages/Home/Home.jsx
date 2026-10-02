import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const OPCOES_MENU = [
  { chave: 'jogar', titulo: 'JOGAR', disponivel: false },
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
      <div style={styles.window}>
        <div style={styles.topBar}>
          <div style={styles.playerInfo}>
            <span><strong style={styles.label}>NOME:</strong> {perfil?.nome ?? usuario.email}</span>
            <span><strong style={styles.label}>LV:</strong> {perfil?.nivel ?? 1}</span>
            <span><strong style={styles.label}>CLASSE:</strong> {perfil?.classe ?? 'Humano'}</span>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            LOGOUT
          </button>
        </div>

        <div style={styles.content}>
          <h1 style={styles.logo}>PROJECT ZERO</h1>

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
    backgroundColor: 'var(--bg-void)',
    fontFamily: 'var(--font-mono)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  window: {
    backgroundColor: 'var(--panel-bg)',
    border: '1px solid var(--accent)',
    boxShadow: '0 0 15px var(--accent-glow)',
    width: '100%',
    maxWidth: '850px',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '6px',
  },
  topBar: {
    backgroundColor: 'var(--panel-bg-alt)',
    padding: '12px 20px',
    borderBottom: '1px solid var(--accent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    borderRadius: '6px 6px 0 0',
  },
  playerInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  label: {
    color: 'var(--text-muted)',
    marginRight: '4px',
  },
  logoutButton: {
    backgroundColor: 'var(--bg-void)',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    borderRadius: '4px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  content: {
    flex: 1,
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
  },
  logo: {
    color: 'var(--accent)',
    margin: 0,
    fontSize: '32px',
    letterSpacing: '6px',
    textShadow: '0 0 12px var(--accent-glow)',
  },
  menu: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '520px',
  },
  menuItem: {
    position: 'relative',
    backgroundColor: 'var(--bg-void)',
    border: '1px solid var(--accent)',
    borderRadius: '4px',
    color: 'var(--accent)',
    padding: '24px 16px',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    textShadow: '0 0 8px var(--accent-glow)',
  },
  menuItemDesabilitado: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  emBreve: {
    display: 'block',
    marginTop: '8px',
    fontSize: '10px',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    textShadow: 'none',
  },
};

export default Home;
