import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// O jogo Godot é exportado para public/jogo/ (npm run build:jogo).
// Sem o export, o servidor devolve o index.html do React no lugar do
// index.js do Godot, por isso conferimos o content-type.
const URL_JOGO = '/jogo/index.html';

function Jogo() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verificando');

  useEffect(() => {
    let ativo = true;

    fetch('/jogo/index.js', { method: 'HEAD' })
      .then((res) => {
        const tipo = res.headers.get('content-type') ?? '';
        if (ativo) setStatus(res.ok && tipo.includes('javascript') ? 'pronto' : 'sem-build');
      })
      .catch(() => {
        if (ativo) setStatus('sem-build');
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button type="button" onClick={() => navigate('/home')} style={styles.voltarButton}>
          VOLTAR
        </button>
        <span style={styles.titulo}>MUNDO CYBER</span>
      </div>

      {status === 'pronto' && (
        <iframe
          src={URL_JOGO}
          title="Project Zero"
          style={styles.iframe}
          allow="fullscreen; autoplay; gamepad"
        />
      )}

      {status === 'sem-build' && (
        <div style={styles.aviso}>
          <h1 style={styles.avisoTitulo}>JOGO AINDA NÃO EXPORTADO</h1>
          <p style={styles.avisoTexto}>
            O build Web do Godot não foi encontrado em <code>public/jogo/</code>. Rode{' '}
            <code>npm run build:jogo</code> com o Godot instalado e recarregue a página.
          </p>
          <button type="button" onClick={() => navigate('/missoes')} style={styles.avisoButton}>
            JOGAR O PROTÓTIPO (MISSÕES)
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--neon-bg)',
    fontFamily: 'var(--font-mono)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 12px',
    borderBottom: '2px solid var(--neon-frame)',
    backgroundColor: 'var(--neon-panel)',
  },
  titulo: {
    color: 'var(--neon-cyan)',
    fontSize: '13px',
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
  iframe: {
    flex: 1,
    width: '100%',
    border: 'none',
    display: 'block',
    backgroundColor: '#000',
  },
  aviso: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '24px',
    textAlign: 'center',
  },
  avisoTitulo: {
    color: 'var(--neon-pink)',
    margin: 0,
    fontSize: '18px',
    letterSpacing: '2px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 8px var(--neon-pink-glow)',
  },
  avisoTexto: {
    color: 'var(--text-primary)',
    fontSize: '13px',
    maxWidth: '420px',
    margin: 0,
    lineHeight: 1.5,
  },
  avisoButton: {
    padding: '12px 20px',
    background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-cyan))',
    color: '#0c0620',
    border: 'none',
    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
};

export default Jogo;
