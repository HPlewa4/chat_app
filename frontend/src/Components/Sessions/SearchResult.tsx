import React from 'react'
import './SearchResult.css'
import './UserBar.css'
import { UserIcon } from 'lucide-react';

interface SearchResultProps {
  name: string;
}

const SearchResult = ({ name }: SearchResultProps) => {
  return (
    <div className="search-result">
      <div className="main-bar">
        <div className="user-section">
            <div className="user-icon-container">
            <UserIcon size={18} color="white" />
            </div>

            <div className="user-info">
            <span className="username">
                {name}
            </span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SearchResult