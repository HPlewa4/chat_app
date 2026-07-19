import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './AllChats.css';
import UserBar from './Sessions/UserBar';
import Search from './Sessions/Search';
import API from "../api";
import SearchResult from './Sessions/SearchResult';


interface User {
  username: string;
  email: string;
}

interface AllChatsProps {
  currentUser: User | null;
  setCurrentUser: (user: any) => void;
}

const AllChats: React.FC<AllChatsProps> = ({ currentUser,setCurrentUser }) => {
  const [users, setUsers] = useState<string[]>([]);
  const searchUsers = async (query: string) => {
    if (!query.trim() || !currentUser?.email) {
      setUsers([]);
      return;
    }

    try {
      const res = await API.get<string[]>("/users/search", {
        params: {
          q: query,
          current_email: currentUser.email,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="all-chats">
      <Search onSearch={searchUsers} />
      <div>
  {users.map((user) => (
    <SearchResult key={user} name={user} />
  ))}
</div>
      <UserBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  )
}

export default AllChats