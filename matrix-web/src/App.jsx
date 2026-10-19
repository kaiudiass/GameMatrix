import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { MatchPage } from './pages/MatchPage/MatchPage';
import './index.css';

function App() {
  return (
    <>
      <div className="crt-overlay"></div>
      <AuthProvider>
        <SocketProvider>
          <GameProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/lobby" element={<LobbyPage />} />
                <Route path="/game" element={<MatchPage />} />
              </Routes>
            </BrowserRouter>
          </GameProvider>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
