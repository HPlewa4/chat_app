import React from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';

interface User {
  username: string;
  email: string;
}

interface UserBarProps {
  currentUser: User | null;
  setCurrentUser: (user: any) => void;
}

const UserBar: React.FC<UserBarProps> = ({ currentUser, setCurrentUser }) => {

  const handleClick = () => {
    if (currentUser) {
      setCurrentUser(null);
      localStorage.removeItem('chat_user');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#924141',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        color: 'white',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', gap: '12px' }}>
        <div style={{
          backgroundColor: 'black',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <UserIcon size={20} strokeWidth={2} />
        </div>
        
        <span style={{ fontWeight: '500' }}>
          {currentUser ? currentUser.username : "Not logged in"}
        </span>
      </div>

      <Link to="/login" style={{ textDecoration: 'none', paddingRight: '20px' }}>
        <button 
          className="login-btn" 
          style={{ 
            cursor: 'pointer',
            margin: 0,
            display: 'block' 
          }}
          onClick={handleClick}
        >
          {currentUser ? "Log out" : "Log in"}
        </button>
      </Link>
    </div>
  );
};

export default UserBar;