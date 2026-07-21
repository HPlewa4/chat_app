import React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import './Settings.css';

interface User {
  username: string;
  email: string;
}

interface SettingsProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, setCurrentUser, setOpenSettings, openSettings }) => {
  
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentUser(null);
    localStorage.removeItem('chat_user');
    navigate('/login');
  };

  const handleCloseSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSettings(false);
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };


  return (
    <div className="settings">
      <div className='header-wrapper'>
        <h2>{t("settings.title")}</h2>
        <button
          onClick={handleCloseSettings}
          className="logout-button"
          title={t("settings.close")}
        >
          <X size={16} />
        </button>
      </div>
      <p>{t("settings.description")}</p>

      <div className="language-selector">
        <label htmlFor="language">
          {t("settings.language")}
        </label>

        <select
          id="language"
          value={i18n.language}
          onChange={changeLanguage}
        >
          <option value="en">
            English
          </option>

          <option value="pl">
            Polski
          </option>
        </select>
      </div>

      <div className="logout-wrapper">
        <span className='logout-text'>{t("logging.logout")}</span>
        <button
          onClick={handleLogout}
          className="logout-button"
          title={t("logging.logout")}
        >
          <LogOut size={16} />
        </button>
      </div>

    </div>
  );
};

export default Settings;