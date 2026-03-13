import React from 'react';
import './Message.css';

interface MessageProps {
  user: string;
  text: string;
  currentUser: string;
}

const Message = ({ user, text, currentUser }: MessageProps) => {
  return (
    <div className={`msg ${user === currentUser ? 'user-message' : 'other-message'}`}>
        {text}
    </div>
  );
};

export default Message;