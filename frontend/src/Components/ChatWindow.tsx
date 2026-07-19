import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import Message from './Chat/Message';
import ChatInput from './Chat/ChatInput';
import ConversationBar from './Chat/ConversationBar';

type MessageType = {
  id?: string;
  user: string;
  text: string;
};

interface User { username: string; email: string; }

interface ChatWindowProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeSessionId: string | null;
  activeOtherUser: string;
  messages: MessageType[];
  onSendMessage: (text: string) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  currentUser, 
  setCurrentUser, 
  activeSessionId, 
  activeOtherUser, 
  messages, 
  onSendMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isScrolledUp = useRef(false);

  useEffect(() => {
    isScrolledUp.current = false;
  }, [activeSessionId]);

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

  if (!activeSessionId) {
    return (
      <div className="chat-window no-session" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Select a conversation to start messaging</h3>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <ConversationBar 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        otherUser={activeOtherUser} 
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
  );
};

export default ChatWindow;