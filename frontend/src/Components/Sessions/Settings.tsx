import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import './Settings.css';
import API from "../../api";

interface User {
  username: string;
  email: string;
  profile_pic?: string;
}

interface SettingsProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, setCurrentUser, setOpenSettings, openSettings }) => {
  const [uploading, setUploading] = useState(false);
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

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentUser) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await API.post(
        `/users/avatar?email=${currentUser.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      const updatedUser = {
        ...currentUser,
        profile_pic: res.data.profile_pic
      };

      setCurrentUser(updatedUser);

      localStorage.setItem(
        "chat_user",
        JSON.stringify(updatedUser)
      );


    } catch (err) {
      console.error(err);
      alert(t("settings.avatarFail"));
    } finally {
      setUploading(false);
    }
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
      <div className="profile-picture-section">

        <input
            id="profile-pic"
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfilePicUpload}
        />

        <label
            htmlFor="profile-pic"
            className="upload-button"
        >
            {t("settings.changePhoto")}
        </label>

        {uploading && (
          <p>{t("settings.uploading")}</p>
        )}

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