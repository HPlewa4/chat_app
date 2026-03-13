import React, { useState, ChangeEvent, JSX } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

interface AuthResponse {
  message: string;
  username?: string;
  email?: string;
  id?: string;
}
interface LoginProps {
  setCurrentUser: (user: any) => void;
}
interface User {
  username: string | undefined;
  email: string | undefined;
}
export default function AuthPage({ setCurrentUser }: LoginProps): JSX.Element {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  
  const navigate = useNavigate();

  const handleAuth = async (): Promise<void> => {
    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        const response = await API.post<AuthResponse>("/users/register", {
          username,
          email,
          password,
          confirm_password: confirmPassword
        });
        const loggedInUser: User = {
          username: response.data.username,
          email: response.data.email
        };
        setCurrentUser(loggedInUser);
        navigate("/");
          
        
        alert("Account created!");
      } else {
        const response = await API.post<AuthResponse>("/users/login", {
          email,
          password
        });
        const loggedInUser: User = {
          username: response.data.username,
          email: response.data.email
        };
        setCurrentUser(loggedInUser);
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);
      const errorDetail = error.response?.data?.detail || "Authentication failed";
      alert(errorDetail);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isRegistering && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          />
        )}

        <button onClick={handleAuth}>
          {isRegistering ? "Sign Up" : "Log In"}
        </button>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        {isRegistering ? (
          <span>
            Already have an account?{" "}
            <button 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setIsRegistering(false)}
            >
              Log in here
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{" "}
            <button 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setIsRegistering(true)}
            >
              Register here
            </button>
          </span>
        )}
      </div>
    </div>
  );
}