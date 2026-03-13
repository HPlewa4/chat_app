import React from 'react'
import { Link } from 'react-router-dom';
import './AllChats.css';

interface User {
  username: string;
  email: string;
}

interface AllChatsProps {
  currentUser: User | null;
}

const AllChats: React.FC<AllChatsProps> = ({ currentUser }) => {
  return (
    <div className="all-chats">
      <div>currentUser: {currentUser ? currentUser.username : "No user logged in"}</div>
      <Link to="/login">
        <button className="login-btn">Go to Login</button>
      </Link>
    </div>
  )
}

export default AllChats