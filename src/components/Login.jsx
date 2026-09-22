import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    console.log('E-mail digitado:', email);
    console.log('Senha digitada:', senha);

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>[ SISTEMA INFECTADO ]</h2>
        
        <form onSubmit={handleSubmit}>
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
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            INICIAR PURGAÇÃO
          </button>
        </form>
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
    backgroundColor: '#060408',
    fontFamily: "'Courier New', Courier, monospace",
  },
  card: {
    backgroundColor: '#14084d',
    padding: '30px',
    borderRadius: '6px',
    border: '1px solid #b9d0e1',
    boxShadow: '0 0 15px rgba(185, 208, 225, 0.25)',
    width: '100%',
    maxWidth: '380px',
    boxSizing: 'border-box',
  },
  title: {
    color: '#b9d0e1',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '20px',
    letterSpacing: '2px',
    textShadow: '0 0 8px rgba(185, 208, 225, 0.6)',
  },
  label: {
    display: 'block',
    color: '#b9d0e1',
    fontSize: '12px',
    marginBottom: '6px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#b9d0e1', 
    border: '1px solid #2e3838', 
    borderRadius: '4px',
    color: '#14084d', // CORRIGIDO: alterado de #b9d0e1 para azul escuro (#14084d)
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Courier New', Courier, monospace",
    boxShadow: '0 0 8px rgba(0, 240, 255, 0.3)', 
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#b9d0e1',
    color: '#14084d',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    fontFamily: "'Courier New', Courier, monospace",
    boxShadow: '0 0 12px rgba(185, 208, 225, 0.4)',
  },
};

export default Login;