import React, { useState } from 'react'
import './ChatWindow.css'
import Message from './Chat/Message'
import ChatInput from './Chat/ChatInput'

type MessageType = {
  user: 'user' | 'other'
  text: string
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([])

  const addMessage = (text: string) => {
    setMessages(prev => [...prev, { user: 'other', text }])
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <Message key={i} user={m.user} text={m.text} />
        ))}
      </div>

      <ChatInput onSend={addMessage} />
    </div>
  )
}

export default ChatWindow