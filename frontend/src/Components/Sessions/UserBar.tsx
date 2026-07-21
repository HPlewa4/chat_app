import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useTranslation } from "react-i18next";
import './UserBar.css';
import SettingsComponent from './Settings';

interface User {
  username: string;
  email: string;
}

interface UserBarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserBar: React.FC<UserBarProps> = ({ currentUser, setCurrentUser }) => {
  const [openSettings, setOpenSettings] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();


  const handleOpenSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSettings(!openSettings);
  };

  return (
    <>
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

          <button
            onClick={handleOpenSettings}
            className="logout-button"
            title={t("settings.settings")}
          >
            <Settings size={16} />
          </button>

      </div>
      {openSettings && 
        <SettingsComponent setCurrentUser={setCurrentUser} currentUser={currentUser} openSettings={openSettings} setOpenSettings={setOpenSettings} />
      }
    </>
  );
};

export default UserBar;