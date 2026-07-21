import React, { useState, KeyboardEvent } from 'react';
import { useTranslation } from "react-i18next";
import './ChatInput.css';
import { Send } from 'lucide-react';

type ChatInputProps = {
  onSend: (text: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");
  const { t } = useTranslation();

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        className="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chatInput.placeholder")}
      />

      <button className="send" onClick={handleSend}>
        <Send />
      </button>
    </div>
  );
};

export default ChatInput;