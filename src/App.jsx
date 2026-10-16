import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Missoes from './pages/Missoes/Missoes';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import Jogo from './pages/Jogo/Jogo';
import Battle from './pages/Battle/Battle';
import GameOver from './pages/GameOver/GameOver';
import { AuthProvider } from './components/AuthContext';
import { GameProvider } from './context/GameContext';
import { ProtectRoute } from './components/ProtectRoute';


function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <ProtectRoute>
                <Home />
              </ProtectRoute>
            }
          />

          <Route
            path="/personagem"
            element={
              <ProtectRoute>
                <Profile />
              </ProtectRoute>
            }
          />

          <Route
            path="/jogo"
            element={
              <ProtectRoute>
                <Jogo />
              </ProtectRoute>
            }
          />

          <Route
            path="/missoes"
            element={
              <ProtectRoute>
                <Missoes />
              </ProtectRoute>
            }
          />

          <Route
            path="/configuracoes"
            element={
              <ProtectRoute>
                <Configuracoes />
              </ProtectRoute>
            }
          />

          <Route
            path="/batalha"
            element={
              <ProtectRoute>
                <Battle />
              </ProtectRoute>
            }
          />

          <Route
            path="/game-over"
            element={
              <ProtectRoute>
                <GameOver />
              </ProtectRoute>
            }
          />
        </Routes>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
