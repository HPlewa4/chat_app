import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import './AllChats.css';
import UserBar from './Sessions/UserBar';
import Search from './Sessions/Search';
import API from "../api";
import UserComponent from './Sessions/User';
import { User, SearchUser} from '../types/user';
import { ChatSession } from '../types/session';


interface AllChatsProps {
  currentUser: User | null;
  setCurrentUser: (user: any) => void;
  setActiveSessionId: (id: string | null) => void;
  refreshTrigger: number;
  setActiveOtherUser: (username: string) => void;
  setActiveOtherUserProfilePic: (pic: string | undefined) => void;
}

const AllChats: React.FC<AllChatsProps> = ({ 
  currentUser, 
  setCurrentUser, 
  setActiveSessionId,
  refreshTrigger,
  setActiveOtherUser,
  setActiveOtherUserProfilePic
}) => {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);
  const { t } = useTranslation();

  const searchUsers = async (query: string) => {
    if (!query.trim() || !currentUser?.email) {
      setUsers([]);
      return;
    }

    try {
      const res = await API.get<SearchUser[]>("/users/search", {
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

  const handleSelectUser = async (targetUser: SearchUser) => {
    try {
      const res = await API.post("/chat/session", {
        current_user: currentUser?.username,
        target_user: targetUser.username
      });

      const sessionId = res.data.id; 
    
      setActiveSessionId(sessionId);
      setActiveOtherUser(targetUser.username);
      setActiveOtherUserProfilePic(targetUser.profile_pic);

      const alreadyActive = activeSessions.some(session => session.id === sessionId);
        if (!alreadyActive) {
          setActiveSessions(prev => [{ 
            id: sessionId, 
            username: targetUser.username,
            last_message: res.data.last_message || t("allChats.noMessages"),
            updated_at: new Date().toISOString(),
            profile_pic: targetUser.profile_pic
          }, ...prev]);
        }

      setUsers([]); 
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

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
            username: otherUser || t("allChats.unknownUser"),
            last_message: session.last_message,
            updated_at: session.updated_at || new Date(0).toISOString(),
            profile_pic: session.profile_pic
          };
        });

        formattedSessions.sort((a, b) => {
          return (
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
          );
        });
        
        setActiveSessions(formattedSessions);

      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchSessions();

  }, [currentUser?.username, refreshTrigger, t]);

  return (
    <div className="all-chats">
      <Search onSearch={searchUsers} />
      <div className="scrollable-element search-results-list">
        {users.map((user) => (
          <UserComponent 
            key={`search-${user.username}`} 
            name={user.username} 
            profilePic={user.profile_pic}
            searching={true}
            onClick={() => handleSelectUser(user)}
          />
        ))}
      </div>
      <div className={`active-chats-list ${users.length > 0 ? 'has-search-results' : ''}`}>
        <h3>{t("allChats.recentChats")}</h3>
        <div className="scrollable-element active-sessions">
          {activeSessions.map((session) => (
            <UserComponent
              key={`session-${session.id}`}
              name={session.username} 
              last_message={session.last_message}
              searching={false}
              profilePic={session.profile_pic}
              onClick={() => {
                setActiveSessionId(session.id);
                setActiveOtherUser(session.username); 
                setActiveOtherUserProfilePic(session.profile_pic);
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