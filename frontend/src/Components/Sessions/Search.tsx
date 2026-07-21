import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Search.css";

interface SearchProps {
  onSearch: (query: string) => void;
  isDisabled?: boolean;
}

const Search: React.FC<SearchProps> = ({ onSearch, isDisabled }) => {
  const [text, setText] = useState("");
  const { t } = useTranslation();

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
        placeholder={
          isDisabled
            ? t("search.loadingProfile")
            : `🔍︎ ${t("search.searchUsers")}`
        }
        className="search-input"
        disabled={isDisabled}
      />
    </div>
  );
};

export default Search;