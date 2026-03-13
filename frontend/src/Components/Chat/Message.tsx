import React from 'react'
import './Message.css'
const Message = ({user,text}: {user: string,text:string}) => {
  return (
    <div className={`msg ${user === 'user' ? 'user-message' : 'other-message'}`}>
        {text}
    </div>
  )
}

export default Message