import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
              <div style={{ display: 'flex' }} className="App">
                <AllChats currentUser={currentUser} />
                <ChatWindow currentUser={currentUser} />
              </div>
            } 
          />

          <Route 
            path="/login" 
            element={<Login setCurrentUser={setCurrentUser} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;