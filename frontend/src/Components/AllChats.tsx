import React, { useState, useEffect } from 'react'
import './AllChats.css';
import UserBar from './Sessions/UserBar';
import Search from './Sessions/Search';
import API from "../api";
import User from './Sessions/User';

interface UserInterface {
  username: string;
  email: string;
}

interface ChatSession {
  id: string;
  username: string;
  last_message: string;
  updated_at: string;
}

interface AllChatsProps {
  currentUser: UserInterface | null;
  setCurrentUser: (user: any) => void;
  setActiveSessionId: (id: string | null) => void;
  refreshTrigger: number;
  setActiveOtherUser: (username: string) => void;
}

const AllChats: React.FC<AllChatsProps> = ({ 
  currentUser, 
  setCurrentUser, 
  setActiveSessionId,
  refreshTrigger,
  setActiveOtherUser
}) => {
  const [users, setUsers] = useState<string[]>([]);
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!currentUser?.username) return;

    const fetchSessions = async () => {
      try {
        const res = await API.get('/chat/sessions', {
          params: { username: currentUser.username }
        });

        const formattedSessions: ChatSession[] = res.data.map((session: any) => {
          const otherUser = session.participants.find((p: string) => p !== currentUser.username);
          return {
            id: session.id,
            username: otherUser || "Unknown User",
            last_message: session.last_message,
            updated_at: session.updated_at || new Date(0).toISOString() 
          };
        });

        formattedSessions.sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        setActiveSessions(formattedSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchSessions();
  }, [currentUser?.username, refreshTrigger]);
  
  const searchUsers = async (query: string) => {
    if (!query.trim() || !currentUser?.email) {
      setUsers([]);
      return;
    }

    try {
      const res = await API.get<string[]>("/users/search", {
        params: {
          q: query,
          current_email: currentUser.email,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = async (targetUsername: string) => {
    try {
      const res = await API.post("/chat/session", {
        current_user: currentUser?.username,
        target_user: targetUsername
      });

      const sessionId = res.data.id; 
    
      setActiveSessionId(sessionId);
      setActiveOtherUser(targetUsername);

      const alreadyActive = activeSessions.some(session => session.id === sessionId);
      if (!alreadyActive) {

        setActiveSessions(prev => [{ 
          id: sessionId, 
          username: targetUsername, 
          last_message: res.data.last_message || "No messages yet",
          updated_at: new Date().toISOString()
        }, ...prev]);
      }

      setUsers([]); 
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  return (
    <div className="all-chats">
      <Search onSearch={searchUsers} />
      <div className="scrollable-element search-results-list">
        {users.map((user) => (
          <User key={`search-${user}`} 
                name={user} 
                searching={true}
                onClick={() => handleSelectUser(user)} />
        ))}
      </div>
      <div className={`active-chats-list ${users.length > 0 ? 'has-search-results' : ''}`}>
        <h3>Recent Chats</h3>
        <div className="scrollable-element active-sessions">
          {activeSessions.map((session) => (
            <User 
              key={`session-${session.id}`}
              name={session.username} 
              last_message={session.last_message}
              searching={false}
              onClick={() => {
                setActiveSessionId(session.id);
                setActiveOtherUser(session.username); 
              }}
            />
          ))}
        </div>  
      </div>
      <UserBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  )
}

export default AllChats;