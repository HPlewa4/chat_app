import React, { useState, useEffect } from 'react'
import './ChatWindow.css'
import Message from './Chat/Message'
import ChatInput from './Chat/ChatInput'
import API from '../api'

type MessageType = {
  id?: string
  user: 'user' | 'other'
  text: string
}

const ChatWindow: React.FC = () => {
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
    const newMsg: MessageType = { user: 'user', text }
    setMessages(prev => [...prev, newMsg]) // optimistic UI

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
          <Message key={m.id || i} user={m.user} text={m.text} />
        ))}
      </div>

      <ChatInput onSend={addMessage} />
    </div>
  )
}

export default ChatWindow