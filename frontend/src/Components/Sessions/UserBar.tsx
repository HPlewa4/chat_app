import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut } from 'lucide-react';

interface User {
  username: string;
  email: string;
}

interface UserBarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserBar: React.FC<UserBarProps> = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setCurrentUser(null);
    localStorage.removeItem('chat_user');
    navigate('/login');
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#2d3436',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      color: 'white',
      padding: '0 16px',
      height: '64px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        flex: 1, 
        minWidth: 0 
      }}>
        <div style={{
          backgroundColor: '#0984e3',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <UserIcon size={18} color="white" />
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          minWidth: 0 
        }}>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '14px',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentUser ? currentUser.username : "Guest"}
          </span>
        </div>
      </div>

      {currentUser ? (
        <button 
          onClick={handleLogout}
          style={{ 
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '6px',
            padding: 0,
            margin: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '32px',
            height: '32px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      ) : (
        <Link to="/login" style={{ 
          fontSize: '13px', 
          color: '#74b9ff', 
          textDecoration: 'none',
          fontWeight: '500',
          flexShrink: 0
        }}>
          Log In
        </Link>
      )}
    </div>
  );
};

export default UserBar;