import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import caixaLogin from '../assets/auth/caixa-login.png';
import labelUser from '../assets/auth/label-user.png';
import labelPassword from '../assets/auth/label-password.png';
import esqueciSenhaImg from '../assets/auth/esqueci-senha.png';
import esqueciSenhaUnderline from '../assets/auth/esqueci-senha-underline.png';
import barraTopo from '../assets/cadastro/barra-topo.png';
import barraBase from '../assets/cadastro/barra-base.png';
import bannerVerde from '../assets/cadastro/banner-verde.png';
import tituloCadastro from '../assets/cadastro/titulo-cadastro.png';
import pilulaInput from '../assets/cadastro/pilula-input.png';
import labelUserCadastro from '../assets/cadastro/label-user.png';
import labelEmailCadastro from '../assets/cadastro/label-email.png';
import labelPasswordCadastro from '../assets/cadastro/label-password.png';
import hintUser from '../assets/cadastro/hint-user.png';
import hintEmail from '../assets/cadastro/hint-email.png';
import btnContinuar from '../assets/cadastro/btn-continuar.png';
import btnVoltar from '../assets/cadastro/btn-voltar.png';

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

    if (modo === 'cadastro' && !nome.trim()) {
      setErro('Informe um nome de agente.');
      return;
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

  if (modo === 'login') {
    return (
      <div className="neon-screen">
        <div className="art-panel" style={{ borderImageSource: `url(${caixaLogin})` }}>
          <form onSubmit={handleSubmit}>
            <div className="art-field" style={{ backgroundImage: `url(${labelUser})` }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agente@antivirus.net"
                aria-label="E-mail"
                required
              />
            </div>

            <div className="art-field" style={{ backgroundImage: `url(${labelPassword})` }}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                aria-label="Senha"
                style={{ paddingRight: '70px' }}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                style={{ ...styles.botaoMostrarSenha, position: 'absolute', right: '14px', top: '75%' }}
              >
                {mostrarSenha ? 'OCULTAR' : 'MOSTRAR'}
              </button>
            </div>

            <button type="button" onClick={() => irPara('recuperar')} className="art-link" style={{ marginBottom: '12px' }}>
              <img src={esqueciSenhaImg} alt="Esqueci a senha" />
              <img src={esqueciSenhaUnderline} alt="" className="underline-img" />
            </button>

            {erro && <p style={styles.erro}>{erro}</p>}
            {aviso && <p style={styles.aviso}>{aviso}</p>}

            <button type="submit" className="neon-button" disabled={enviando}>
              {enviando ? 'PROCESSANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="neon-footer">
            <button type="button" onClick={() => irPara('cadastro')} className="neon-link">
              Não tem conta? Cadastre-se
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modo === 'cadastro') {
    return (
      <div style={styles.telaCadastro}>
        <div style={styles.colunaCadastro}>
          <img src={barraTopo} alt="" style={{ width: '100%', display: 'block' }} />

          <div style={{ position: 'relative' }}>
            <img src={bannerVerde} alt="" style={{ width: '100%', display: 'block' }} />
            <img
              src={tituloCadastro}
              alt="Novo por aqui? Cadastre-se"
              style={{ position: 'absolute', top: '27.9%', left: '20.6%', width: '58.7%' , color: '#FAFAFA'}}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              background: 'var(--neon-bg)',
              padding: '12px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ marginBottom: '18px' }}>
              <div style={styles.linhaLabel}>
                <img src={labelUserCadastro} alt="User" style={{ height: '26px' }} />
                <img src={hintUser} alt="O user deve ser único" style={{ height: '9px' }} />
              </div>
              <div className="art-field-cadastro" style={{ backgroundImage: `url(${pilulaInput})` }}>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Agente Fantasma"
                  aria-label="Nome de usuário"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={styles.linhaLabel}>
                <img src={labelEmailCadastro} alt="Email" style={{ height: '26px' }} />
                <img src={hintEmail} alt="E-mail pessoal" style={{ height: '9px' }} />
              </div>
              <div className="art-field-cadastro" style={{ backgroundImage: `url(${pilulaInput})` }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agente@antivirus.net"
                  aria-label="E-mail"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={styles.linhaLabel}>
                <img src={labelPasswordCadastro} alt="Password" style={{ height: '26px' }} />
                <span style={styles.hintTexto}>MÍNIMO 6 CARACTERES</span>
              </div>
              <div className="art-field-cadastro" style={{ backgroundImage: `url(${pilulaInput})` }}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Senha"
                  style={{ paddingRight: '70px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  style={{ ...styles.botaoMostrarSenha, position: 'absolute', right: '14px', top: '75%', color: 'var(--neon-bg)' }}
                >
                  {mostrarSenha ? 'OCULTAR' : 'MOSTRAR'}
                </button>
              </div>
            </div>

            {erro && <p style={styles.erro}>{erro}</p>}
            {aviso && <p style={styles.aviso}>{aviso}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', gap: '16px' }}>
              <button type="button" onClick={() => irPara('login')} style={styles.botaoIcone}>
                <img src={btnVoltar} alt="Voltar" style={{ height: '18px', width: 'auto', display: 'block' }} />
              </button>
              <button type="submit" style={styles.botaoIcone} disabled={enviando}>
                <img
                  src={btnContinuar}
                  alt={enviando ? 'Processando...' : 'Continuar'}
                  style={{ height: '18px', width: 'auto', display: 'block' }}
                />
              </button>
            </div>
          </form>

          <img src={barraBase} alt="" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="neon-screen">
      <div className="neon-panel">
        <span className="neon-dot" />
        <h2 className="neon-title">RECUPERAR SENHA</h2>

        <form onSubmit={handleSubmit}>
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

          {erro && <p style={styles.erro}>{erro}</p>}
          {aviso && <p style={styles.aviso}>{aviso}</p>}

          <button type="submit" className="neon-button" disabled={enviando}>
            {enviando ? 'PROCESSANDO...' : 'ENVIAR LINK'}
          </button>
        </form>

        <div className="neon-footer">
          <button type="button" onClick={() => irPara('login')} className="neon-link">
            VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  telaCadastro: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    background: 'var(--neon-bg)',
  },
  colunaCadastro: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  },
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
  linhaLabel: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  hintTexto: {
    color: 'var(--text-primary)',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    opacity: 0.8,
  },
  botaoIcone: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    flexShrink: 0,
  },
};

export default Login;