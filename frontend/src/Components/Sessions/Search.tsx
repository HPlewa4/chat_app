import React, { useState } from "react";
import "./Search.css";

interface SearchProps {
  onSearch: (query: string) => void;
  isDisabled?: boolean;
}

const Search: React.FC<SearchProps> = ({ onSearch, isDisabled }) => {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={isDisabled ? "Loading user profile..." : "🔍︎​  Search users..."}
        className="search-input"
        disabled={isDisabled}
      />
    </div>
  );
};

export default Search;