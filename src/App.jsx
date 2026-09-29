import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {AuthProvider} from './components/AuthContext';
import {ProtectRoute} from './components/ProtectRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
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
export default App;