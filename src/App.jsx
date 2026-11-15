import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Ranking } from './components/Ranking';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ranking" element={<Ranking />} />
    </Routes>
  );
}

export default App;