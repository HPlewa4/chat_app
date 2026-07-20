import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllChats from './Components/AllChats';
import ChatWindow from './Components/ChatWindow';
import Login from './Components/Login';
import API from './api';
import './App.css';

interface User { username: string; email: string; }
type MessageType = { id?: string; user: string; text: string; };

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('chat_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeOtherUser, setActiveOtherUser] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chat_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('chat_user');
    }
  }, [currentUser]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await API.get<MessageType[]>('/chat/messages', {
        params: { session_id: activeSessionId }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    fetchMessages();

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [activeSessionId, fetchMessages]);

  const sendMessage = async (text: string) => {
    if (!activeSessionId || !currentUser) return;

    const newMsg = { 
      user: currentUser.username, 
      text,
      session_id: activeSessionId 
    };
    
    setMessages(prev => [...prev, newMsg]);

    try {
      const res = await API.post<{ id: string }>('/chat/message', newMsg);
      await fetchMessages();
      setMessages(prev =>
        prev.map(msg => 
          msg.text === text && msg.user === currentUser.username && !msg.id
            ? { ...msg, id: res.data.id } 
            : msg
        )
      );

      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const sidebarInterval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 3000);

    return () => clearInterval(sidebarInterval);
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
                  <AllChats 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser} 
                    setActiveSessionId={setActiveSessionId} 
                    setActiveOtherUser={setActiveOtherUser}
                    refreshTrigger={refreshTrigger}
                  />
                  <ChatWindow 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser}
                    activeSessionId={activeSessionId} 
                    activeOtherUser={activeOtherUser}
                    messages={messages}
                    onSendMessage={sendMessage}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={!currentUser ? <Login setCurrentUser={setCurrentUser} /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;