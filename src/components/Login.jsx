import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const MENSAGENS_ERRO = {
  'Invalid login credentials': 'E-mail ou senha inválidos.',
  'User already registered': 'Já existe uma conta com esse e-mail.',
  'email rate limit exceeded': 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.',
};

function traduzErro(mensagem) {
  return MENSAGENS_ERRO[mensagem] ?? mensagem;
}

function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro' | 'recuperar'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { usuario, carregando, modoRecuperacao, login, cadastrar, recuperarSenha, atualizarSenha } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && usuario && !modoRecuperacao) {
      navigate('/home', { replace: true });
    }
  }, [usuario, carregando, modoRecuperacao, navigate]);

  const limparMensagens = () => {
    setErro('');
    setAviso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modo === 'recuperar') {
      const emailLimpo = email.trim();
      if (!emailLimpo) {
        setErro('Informe um e-mail válido.');
        return;
      }
      limparMensagens();
      setEnviando(true);
      const { error } = await recuperarSenha(emailLimpo);
      setEnviando(false);
      if (error) {
        setErro(traduzErro(error.message));
      } else {
        setAviso('Link de recuperação enviado! Confira seu e-mail.');
      }
      return;
    }

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

    limparMensagens();
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

  const handleDefinirNovaSenha = async (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    limparMensagens();
    setEnviando(true);
    const { error } = await atualizarSenha(senha);
    setEnviando(false);

    if (error) {
      setErro(error.message);
    } else {
      navigate('/home', { replace: true });
    }
  };

  const irPara = (novoModo) => {
    limparMensagens();
    setModo(novoModo);
  };

  if (modoRecuperacao) {
    return (
      <div className="neon-screen">
        <div className="neon-panel">
          <span className="neon-dot" />
          <h2 className="neon-title">DEFINIR NOVA SENHA</h2>

          <form onSubmit={handleDefinirNovaSenha}>
            <div style={{ marginBottom: '16px' }}>
              <label className="neon-label pink">
                <span className="dot" />
                NOVA SENHA//
              </label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="neon-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="neon-label pink">
                <span className="dot" />
                CONFIRMAR SENHA//
              </label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="neon-input"
                placeholder="••••••••"
                required
              />
            </div>

            {erro && <p style={styles.erro}>{erro}</p>}

            <button type="submit" className="neon-button" disabled={enviando}>
              {enviando ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="neon-screen">
      <div className="neon-panel">
        <span className="neon-dot" />
        <h2 className="neon-title">
          {modo === 'login' && 'ACESSO AO SISTEMA'}
          {modo === 'cadastro' && 'NOVO POR AQUI? CADASTRE-SE'}
          {modo === 'recuperar' && 'RECUPERAR SENHA'}
        </h2>

        <form onSubmit={handleSubmit}>
          {modo === 'cadastro' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="neon-label lime">
                <span className="dot" />
                USER//
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="neon-input"
                placeholder="Agente Fantasma"
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label className="neon-label lime">
              <span className="dot" />
              EMAIL//
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neon-input"
              placeholder="agente@antivirus.net"
              required
            />
          </div>

          {modo !== 'recuperar' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="neon-label pink">
                <span className="dot" />
                PASSWORD//
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="neon-input"
                  style={{ paddingRight: '70px' }}
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
          )}

          {modo === 'cadastro' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="neon-label pink">
                <span className="dot" />
                CONFIRMAR PASSWORD//
              </label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="neon-input"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {modo === 'login' && (
            <button type="button" onClick={() => irPara('recuperar')} className="neon-link" style={{ display: 'block', marginBottom: '16px' }}>
              ESQUECI A SENHA
            </button>
          )}

          {erro && <p style={styles.erro}>{erro}</p>}
          {aviso && <p style={styles.aviso}>{aviso}</p>}

          <button type="submit" className="neon-button" disabled={enviando}>
            {enviando
              ? 'PROCESSANDO...'
              : modo === 'login'
              ? 'ENTRAR'
              : modo === 'cadastro'
              ? 'CONTINUAR >'
              : 'ENVIAR LINK'}
          </button>
        </form>

        <div className="neon-footer">
          {modo === 'recuperar' ? (
            <button type="button" onClick={() => irPara('login')} className="neon-link">
              VOLTAR
            </button>
          ) : (
            <button
              type="button"
              onClick={() => irPara(modo === 'login' ? 'cadastro' : 'login')}
              className="neon-link"
            >
              {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  erro: {
    color: 'var(--danger)',
    fontSize: '12px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  aviso: {
    color: 'var(--neon-cyan)',
    fontSize: '12px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  botaoMostrarSenha: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--neon-cyan)',
    opacity: 0.8,
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    padding: '4px 6px',
  },
};

export default Login;
