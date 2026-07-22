import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import './ChatWindow.css';
import Message from './Chat/Message';
import ChatInput from './Chat/ChatInput';
import ConversationBar from './Chat/ConversationBar';
import ChatSettings from './Chat/ChatSettings';

type MessageType = {
  id?: string;
  user: string;
  text: string;
};

interface User {
  username: string;
  email: string;
  profile_pic?: string;
}

interface ChatWindowProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeSessionId: string | null;
  activeOtherUser: string;
  otherUserProfilePic?: string;
  messages: MessageType[];
  onSendMessage: (text: string) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  currentUser, 
  setCurrentUser, 
  activeSessionId, 
  activeOtherUser, 
  messages, 
  onSendMessage,
  otherUserProfilePic
}) => {

  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isScrolledUp = useRef(false);
  const { t } = useTranslation();
  
  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    
    isScrolledUp.current = scrollHeight - scrollTop - clientHeight > 50;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isScrolledUp.current) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    isScrolledUp.current = false;
  }, [activeSessionId]);

  if (!activeSessionId) {
    return (
      <div className="chat-window no-session" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>{t("chatWindow.selectConversation")}</h3>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-main-content">
        <ConversationBar 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
          otherUser={activeOtherUser} 
          onToggleSettings={toggleSettings}
          otherUserProfilePic={otherUserProfilePic}
        />
        
        <div className="messages" ref={messagesContainerRef} onScroll={handleScroll}>
          {messages.map((m, i) => (
            <Message 
              key={m.id || i} 
              user={m.user} 
              text={m.text} 
              currentUser={currentUser?.username || ''}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={async (text) => {
          isScrolledUp.current = false; 
          await onSendMessage(text);
          scrollToBottom();
        }} />
      </div>

      <div className={`settings-sidebar ${showSettings ? 'open' : ''}`}>
        <ChatSettings />
      </div>
    </div>
  );
};

export default ChatWindow;