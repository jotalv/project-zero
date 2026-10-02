import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabaseClient';

function Profile() {
  const { usuario, atualizarSenha } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

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

  const abrirFormSenha = () => {
    setErro('');
    setSucesso('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setMostrarForm(true);
  };

  const handleTrocarSenha = async (e) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setErro('');
    setEnviando(true);
    const { error } = await atualizarSenha(novaSenha);
    setEnviando(false);

    if (error) {
      setErro(error.message);
    } else {
      setSucesso('Senha atualizada com sucesso.');
      setMostrarForm(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.window}>
        <div style={styles.topBar}>
          <h1 style={styles.titulo}>PERSONAGEM</h1>
          <button type="button" onClick={() => navigate('/home')} style={styles.voltarButton}>
            VOLTAR
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.linha}>
              <span style={styles.label}>NOME//</span>
              <span style={styles.valor}>{perfil?.nome ?? usuario.email}</span>
            </div>
            <div style={styles.linha}>
              <span style={styles.label}>E-MAIL//</span>
              <span style={styles.valor}>{usuario.email}</span>
            </div>
            <div style={styles.linha}>
              <span style={styles.label}>NÍVEL//</span>
              <span style={styles.valor}>{perfil?.nivel ?? 1}</span>
            </div>
            <div style={styles.linha}>
              <span style={styles.label}>CLASSE//</span>
              <span style={styles.valor}>{perfil?.classe ?? 'Humano'}</span>
            </div>

            {!mostrarForm ? (
              <button type="button" onClick={abrirFormSenha} style={styles.trocarSenhaButton}>
                TROCAR SENHA
              </button>
            ) : (
              <form onSubmit={handleTrocarSenha} style={styles.formSenha}>
                <label style={styles.labelForm}>NOVA SENHA//</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                />

                <label style={{ ...styles.labelForm, marginTop: '12px' }}>CONFIRMAR NOVA SENHA//</label>
                <input
                  type="password"
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                />

                {erro && <p style={styles.erro}>{erro}</p>}

                <div style={styles.acoesForm}>
                  <button type="submit" style={styles.salvarButton} disabled={enviando}>
                    {enviando ? 'SALVANDO...' : 'SALVAR'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarForm(false)}
                    style={styles.cancelarButton}
                  >
                    CANCELAR
                  </button>
                </div>
              </form>
            )}

            {sucesso && <p style={styles.sucesso}>{sucesso}</p>}
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
    maxWidth: '520px',
    minHeight: '420px',
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
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '360px',
  },
  linha: {
    display: 'flex',
    justifyContent: 'space-between',
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
  labelForm: {
    display: 'block',
    color: 'var(--neon-cyan)',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontFamily: 'var(--font-display)',
  },
  valor: {
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  trocarSenhaButton: {
    width: '100%',
    marginTop: '24px',
    padding: '12px',
    background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-cyan))',
    color: '#0c0620',
    border: 'none',
    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  formSenha: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '6px',
    backgroundColor: 'rgba(6, 4, 12, 0.4)',
    border: '1px solid var(--neon-cyan)',
    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-mono)',
  },
  erro: {
    color: 'var(--danger)',
    fontSize: '12px',
    marginTop: '10px',
    textAlign: 'center',
  },
  sucesso: {
    color: 'var(--neon-cyan)',
    fontSize: '12px',
    marginTop: '16px',
    textAlign: 'center',
  },
  acoesForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  salvarButton: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-cyan))',
    color: '#0c0620',
    border: 'none',
    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  cancelarButton: {
    flex: 1,
    padding: '10px',
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

export default Profile;
