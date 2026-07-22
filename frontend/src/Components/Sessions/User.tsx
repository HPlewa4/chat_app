import React from 'react'
import './User.css'
import './UserBar.css'
import { UserIcon } from 'lucide-react';

interface UserProps {
  name: string;
  profilePic?: string;
  last_message?: string;
  searching?: boolean;
  onClick?: () => void;
}

const User = ({ name, last_message, searching, onClick, profilePic }: UserProps) => {
  return (
    <div className="search-result" onClick={onClick}>
      <div className="main-bar">
        <div className="user-section">
          <div className="user-icon-container">
              {profilePic ? (
                <img
                  src={`http://localhost:8000/uploads/${profilePic}`}
                  alt={name}
                  className="profile-picture"
                />
              ) : (
                <UserIcon size={18} color="white" />
              )}
          </div>

          <div className="user-info">
            <span className="username">
              {name}
            </span>
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