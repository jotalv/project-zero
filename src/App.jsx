import React from 'react';
<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import { ProtectRoute } from './components/ProtectRoute';
=======
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {AuthProvider} from './components/AuthContext';
import {ProtectRoute} from './components/ProtectRoute';
>>>>>>> f41c87ef1910cbe4e0256516b830551feb7bcf0e

function App() {
  return (
    <AuthProvider>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Login />} />

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

=======
        <Route path="/" element={<Login/>} />
        <Route
        path="/Dashboard"
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
>>>>>>> f41c87ef1910cbe4e0256516b830551feb7bcf0e
export default App;