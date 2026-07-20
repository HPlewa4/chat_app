import React from 'react';
import { Link } from 'react-router-dom';
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
  onToggleSettings?: () => void;
}

const ConversationBar: React.FC<ConversationBarProps> = ({ currentUser, otherUser, onToggleSettings }) => {

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
          onClick={onToggleSettings}
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