import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ChatSettings.css";
import API from "../../api";

interface ChatSettingsProps {
  activeSessionId: string | null;
}

const DEFAULT_THEME = {
  chat_bg: "#161b22",
  message_user: "#1e84c0",
  message_other: "#153668",
};

const ChatSettings: React.FC<ChatSettingsProps> = ({ activeSessionId }) => {
  const { t } = useTranslation();

  const [chatBg, setChatBg] = useState(DEFAULT_THEME.chat_bg);
  const [userMessageColor, setUserMessageColor] = useState(
    DEFAULT_THEME.message_user
  );
  const [otherMessageColor, setOtherMessageColor] = useState(
    DEFAULT_THEME.message_other
  );

  const applyTheme = (
    chatBg: string,
    userColor: string,
    otherColor: string
  ) => {
    document.documentElement.style.setProperty("--chat-bg", chatBg);
    document.documentElement.style.setProperty(
      "--message-color-user",
      userColor
    );
    document.documentElement.style.setProperty(
      "--message-color-other",
      otherColor
    );
  };

  useEffect(() => {
    if (!activeSessionId) return;

    const loadTheme = async () => {
      try {
        const response = await API.get(`/chat/session/${activeSessionId}/theme`);

        if (response.status !== 200) {
          applyTheme(
            DEFAULT_THEME.chat_bg,
            DEFAULT_THEME.message_user,
            DEFAULT_THEME.message_other
          );
          return;
        }

        const theme = response.data;

        const chat = theme.chat_bg ?? DEFAULT_THEME.chat_bg;
        const user = theme.message_user ?? DEFAULT_THEME.message_user;
        const other = theme.message_other ?? DEFAULT_THEME.message_other;

        setChatBg(chat);
        setUserMessageColor(user);
        setOtherMessageColor(other);

        applyTheme(chat, user, other);
      } catch {
        applyTheme(
          DEFAULT_THEME.chat_bg,
          DEFAULT_THEME.message_user,
          DEFAULT_THEME.message_other
        );
      }
    };

    loadTheme();
  }, [activeSessionId]);

  const saveTheme = async () => {
    if (!activeSessionId) return;

    try {
      const response = await API.put(
          `/chat/session/${activeSessionId}/theme`,
          {
              chat_bg: chatBg,
              message_user: userMessageColor,
              message_other: otherMessageColor,
          }
      );

      if (response.status !== 200){
        throw new Error("Failed to save theme");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to save theme.");
    }
  };

  return (
    <div className="chat-settings">
      <h3>{t("chatSettings.title")}</h3>
      <p>{t("chatSettings.description")}</p>

      <div className="setting-group">
        <label htmlFor="chat-bg-picker">{t("chatSettings.bgColor")}</label>
        <input
          id="chat-bg-picker"
          type="color"
          value={chatBg}
          className="buttons"
          onChange={(e) => {
            const value = e.target.value;
            setChatBg(value);
            applyTheme(value, userMessageColor, otherMessageColor);
          }}
        />
      </div>

      <div className="setting-group">
        <label htmlFor="user-message-picker">{t("chatSettings.yourMSG")}</label>
        <input
          id="user-message-picker"
          type="color"
          className="buttons"
          value={userMessageColor}
          onChange={(e) => {
            const value = e.target.value;
            setUserMessageColor(value);
            applyTheme(chatBg, value, otherMessageColor);
          }}
        />
      </div>

      <div className="setting-group">
        <label htmlFor="other-message-picker">{t("chatSettings.otherMSG")}</label>
        <input
          id="other-message-picker"
          type="color"
          value={otherMessageColor}
          className="buttons"
          onChange={(e) => {
            const value = e.target.value;
            setOtherMessageColor(value);
            applyTheme(chatBg, userMessageColor, value);
          }}
        />
      </div>

      <button onClick={saveTheme}>
        {t("chatSettings.saveTheme", "Save Theme")}
      </button>
    </div>
  );
};

export default ChatSettings;