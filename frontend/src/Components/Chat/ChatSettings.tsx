import React from 'react';
import { useTranslation } from "react-i18next";
import './ChatSettings.css';

const ChatSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="chat-settings">
      <h3>{t("chatSettings.title")}</h3>
      <p>{t("chatSettings.description")}</p>
    </div>
  );
};

export default ChatSettings;