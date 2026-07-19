import React from 'react'
import './User.css'
import './UserBar.css'
import { UserIcon } from 'lucide-react';

interface UserProps {
  name: string;
  last_message?: string;
  searching?: boolean;
  onClick?: () => void;
}

const User = ({ name, last_message, searching, onClick }: UserProps) => {
  return (
    <div className="search-result" onClick={onClick}>
      <div className="main-bar">
        <div className="user-section">
          <div className="user-icon-container">
            <UserIcon size={18} color="white" />
          </div>

          <div className="user-info">
            <span className="username">
              {name}
            </span>
            {/* Moved inside user-info so it stacks below the username */}
            {last_message && (
              <div className="last-message">
                {last_message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default User