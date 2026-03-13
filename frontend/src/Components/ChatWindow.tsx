import React, { useState, useEffect } from 'react'
import './ChatWindow.css'
import Message from './Chat/Message'
import ChatInput from './Chat/ChatInput'
import API from '../api'

type MessageType = {
  id?: string
  user: string
  text: string
}
interface User {
  username: string;
  email: string;
}

interface ChatWindowProps {
  currentUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get<MessageType[]>('/chat/messages')
        setMessages(res.data)
      } catch (err) {
        console.error("Failed to fetch messages", err)
      }
    }
    fetchMessages()
  }, [])

  const addMessage = async (text: string) => {
    const newMsg: MessageType = { user: currentUser?.username || 'Unknown User', text }
    setMessages(prev => [...prev, newMsg])

    try {
      const res = await API.post<{ id: string }>('/chat/message', newMsg)
      setMessages(prev =>
        prev.map(msg =>
          msg === newMsg ? { ...msg, id: res.data.id } : msg
        )
      )
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <Message 
              key={m.id || i} 
              user={m.user} 
              text={m.text} 
              currentUser={currentUser?.username || ''}/>
        ))}
      </div>

      <ChatInput onSend={addMessage} />
    </div>
  )
}

export default ChatWindow