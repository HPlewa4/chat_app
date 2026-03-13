import React from 'react'
import { Link } from 'react-router-dom';
import './AllChats.css';
import UserBar from './Sessions/UserBar';

interface User {
  username: string;
  email: string;
}

interface AllChatsProps {
  currentUser: User | null;
  setCurrentUser: (user: any) => void;
}

const AllChats: React.FC<AllChatsProps> = ({ currentUser,setCurrentUser }) => {
  return (
    <div className="all-chats">
      <UserBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  )
}

export default AllChats