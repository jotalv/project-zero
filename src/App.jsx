import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import { AuthProvider } from './components/AuthContext';
import { ProtectRoute } from './components/ProtectRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Tela Inicial do Jogo */}
        <Route path="/" element={<Home />} />

        {/* Tela de Login */}
        <Route path="/login" element={<Login />} />

        {/* Tela de Ranking */}
        <Route path="/ranking" element={<Ranking />} />

        {/* Dashboard / Jogo Protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;