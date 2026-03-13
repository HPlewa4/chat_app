import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllChats from './Components/AllChats';
import ChatWindow from './Components/ChatWindow';
import Login from './Components/Login';
import './App.css';

interface User {
  username: string;
  email: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('chat_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chat_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('chat_user');
    }
  }, [currentUser]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? (
                <div style={{ display: 'flex' }} className="App">
                  <AllChats currentUser={currentUser} setCurrentUser={setCurrentUser} />
                  <ChatWindow currentUser={currentUser} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          <Route 
            path="/login" 
            element={
              !currentUser ? (
                <Login setCurrentUser={setCurrentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;