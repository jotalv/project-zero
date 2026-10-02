import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import World from './pages/World/World';
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
            path="/mundo"
            element={
              <ProtectRoute>
                <World />
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
