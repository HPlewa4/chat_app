import React, { useState, KeyboardEvent } from 'react'
import './ChatInput.css'
import { Send, SendHorizonal } from 'lucide-react'

type ChatInputProps = {
  onSend: (text: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("")

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <input
        type="text"
        className="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />

      <button className="send" onClick={handleSend}>
        <Send/>
      </button>
    </div>
  )
}

export default ChatInput