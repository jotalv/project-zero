import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const MENSAGENS_ERRO = {
  'Invalid login credentials': 'E-mail ou senha inválidos.',
  'User already registered': 'Já existe uma conta com esse e-mail.',
  'email rate limit exceeded': 'Muitas tentativas de cadastro em pouco tempo. Aguarde alguns minutos e tente de novo.',
};

function traduzErro(mensagem) {
  return MENSAGENS_ERRO[mensagem] ?? mensagem;
}

function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { usuario, carregando, login, cadastrar } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && usuario) {
      navigate('/home', { replace: true });
    }
  }, [usuario, carregando, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailLimpo = email.trim();
    if (!emailLimpo) {
      setErro('Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (modo === 'cadastro') {
      if (!nome.trim()) {
        setErro('Informe um nome de agente.');
        return;
      }
      if (senha !== confirmarSenha) {
        setErro('As senhas não coincidem.');
        return;
      }
    }

    setErro('');
    setAviso('');
    setEnviando(true);

    if (modo === 'login') {
      const { error } = await login(emailLimpo, senha);
      if (error) {
        setErro(traduzErro(error.message));
      } else {
        navigate('/home');
      }
    } else {
      const { precisaConfirmarEmail, error } = await cadastrar(emailLimpo, senha, nome.trim());
      if (error) {
        setErro(traduzErro(error.message));
      } else if (precisaConfirmarEmail) {
        setAviso('Conta criada! Verifique seu e-mail para confirmar o acesso antes de entrar.');
        setModo('login');
      } else {
        navigate('/home');
      }
    }

    setEnviando(false);
  };

  const alternarModo = () => {
    setErro('');
    setAviso('');
    setModo((m) => (m === 'login' ? 'cadastro' : 'login'));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>[ SISTEMA INFECTADO ]</h2>

        <form onSubmit={handleSubmit}>
          {modo === 'cadastro' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={styles.label}>NOME DO AGENTE:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
                placeholder="Agente Fantasma"
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={styles.label}>IDENTIFICAÇÃO (E-MAIL):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="agente@antivirus.net"
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={styles.label}>CHAVE DE ACESSO (SENHA):</label>
            <div style={styles.inputComBotao}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{ ...styles.input, paddingRight: '70px' }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                style={styles.botaoMostrarSenha}
              >
                {mostrarSenha ? 'OCULTAR' : 'MOSTRAR'}
              </button>
            </div>
          </div>

          {modo === 'cadastro' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={styles.label}>CONFIRMAR SENHA:</label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {erro && <p style={styles.erro}>{erro}</p>}
          {aviso && <p style={styles.aviso}>{aviso}</p>}

          <button type="submit" style={styles.button} disabled={enviando}>
            {enviando ? 'PROCESSANDO...' : modo === 'login' ? 'INICIAR PURGAÇÃO' : 'REGISTRAR AGENTE'}
          </button>
        </form>

        <button type="button" onClick={alternarModo} style={styles.linkAlternar}>
          {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
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
    backgroundColor: 'var(--bg-void)',
    fontFamily: 'var(--font-mono)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'var(--panel-bg)',
    padding: '30px',
    borderRadius: '6px',
    border: '1px solid var(--accent)',
    boxShadow: '0 0 15px var(--accent-glow)',
    width: '100%',
    maxWidth: '380px',
    boxSizing: 'border-box',
  },
  title: {
    color: 'var(--accent)',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '20px',
    letterSpacing: '2px',
    textShadow: '0 0 8px var(--accent-glow)',
  },
  erro: {
    color: 'var(--danger)',
    fontSize: '12px',
    marginTop: '-5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  aviso: {
    color: 'var(--accent)',
    fontSize: '12px',
    marginTop: '-5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    color: 'var(--accent)',
    fontSize: '12px',
    marginBottom: '6px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'var(--accent)',
    border: '1px solid #2e3838',
    borderRadius: '4px',
    color: 'var(--panel-bg)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-mono)',
    boxShadow: '0 0 8px var(--accent-glow)',
  },
  inputComBotao: {
    position: 'relative',
  },
  botaoMostrarSenha: {
    position: 'absolute',
    right: '6px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--panel-bg)',
    opacity: 0.6,
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    padding: '4px 6px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--accent)',
    color: 'var(--panel-bg)',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    fontFamily: 'var(--font-mono)',
    boxShadow: '0 0 12px var(--accent-glow)',
  },
  linkAlternar: {
    display: 'block',
    width: '100%',
    marginTop: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textAlign: 'center',
  },
};

export default Login;
