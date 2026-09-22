import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [estaLogado, setEstaLogado] = useState(false);

  const realizarLogin = () => {
    setEstaLogado(true);
  };

  return (
    <div>
{estaLogado ? (
  <Dashboard onLogout={() => setEstaLogado(false)} />
) : (
  <Login onLogin={realizarLogin} />
)}
    </div>
  );
}

export default App;