import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Ellipsis } from 'lucide-react';
import './ConversationBar.css';
interface User {
  username: string;
  email: string;
}

interface ConversationBarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  otherUser: string;
}

const ConversationBar: React.FC<ConversationBarProps> = ({ currentUser, setCurrentUser, otherUser }) => {
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setCurrentUser(null);
    localStorage.removeItem('chat_user');
    navigate('/login');
  };

  return (
   <div className="main-bar">
      <div className="user-section">
        <div className="user-icon-container">
          <UserIcon size={18} color="white" />
        </div>

        <div className="user-info">
          <span className="username">
            {otherUser}
          </span>
        </div>
      </div>

      {currentUser ? (
        <button
          onClick={()=>{}}
          className="conversation-button"
        >
          <Ellipsis size={16} />
        </button>
      ) : (
        <Link to="/login" className="login-link">
          Log In
        </Link>
      )}
    </div>
  );
};

export default ConversationBar;