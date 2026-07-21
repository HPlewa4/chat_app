import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useTranslation } from "react-i18next";
import './UserBar.css';

interface User {
  username: string;
  email: string;
}

interface UserBarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserBar: React.FC<UserBarProps> = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {currentUser ? currentUser.username : t("userBar.guest")}
          </span>
        </div>
      </div>

      {currentUser ? (
        <button
          onClick={handleLogout}
          className="logout-button"
          title={t("userBar.logout")}
        >
          <LogOut size={16} />
        </button>
      ) : (
        <Link to="/login" className="login-link">
          {t("userBar.login")}
        </Link>
      )}
    </div>
  );
};

export default UserBar;