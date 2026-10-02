import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import { AuthProvider } from './components/AuthContext';
import { ProtectRoute } from './components/ProtectRoute';


function App() {
  return (
    <AuthProvider>
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
      </Routes>
    </AuthProvider>
  );
}

export default App;