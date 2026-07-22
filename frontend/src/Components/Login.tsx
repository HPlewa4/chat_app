import React, { useState, ChangeEvent, JSX } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {User} from "../types/user"
import { AuthResponse } from "../types/auth";

interface LoginProps {
  setCurrentUser: (user: any) => void;
}


export default function Login({ setCurrentUser }: LoginProps): JSX.Element {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAuth = async (): Promise<void> => {
    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          alert(t("login.passwordsDoNotMatch"));
          return;
        }

        const response = await API.post<AuthResponse>("/users/register", {
          username,
          email,
          password,
          confirm_password: confirmPassword,
        });

        const loggedInUser: User = {
          username: response.data.username || username,
          email: response.data.email || email,
        };

        setCurrentUser(loggedInUser);
        navigate("/");
        alert(t("login.accountCreated"));
        
      } else {
        const response = await API.post<AuthResponse>("/users/login", {
          email,
          password,
        });

        const loggedInUser: User = {
          username: response.data.username,
          email: response.data.email,
          profile_pic: response.data.profile_pic,
        };

        setCurrentUser(loggedInUser);
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);

      const errorDetail =
        error.response?.data?.detail || t("login.authenticationFailed");

      alert(errorDetail);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
    >
      <h2>
        {isRegistering
          ? t("login.titleRegister")
          : t("login.titleLogin")}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {isRegistering && (
          <input
            placeholder={t("login.username")}
            value={username}
            style={{ padding: "10px 0" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        )}

        <input
          type="email"
          placeholder={t("login.email")}
          value={email}
          autoComplete="email"
          style={{ padding: "10px 0" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          style={{ padding: "10px 0" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        {isRegistering && (
          <input
            type="password"
            placeholder={t("login.confirmPassword")}
            value={confirmPassword}
            style={{ padding: "10px 0" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        )}

        <button onClick={handleAuth}>
          {isRegistering
            ? t("login.registerButton")
            : t("login.loginButton")}
        </button>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        {isRegistering ? (
          <span>
            {t("login.alreadyHaveAccount")}{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setIsRegistering(false)}
            >
              {t("login.loginHere")}
            </button>
          </span>
        ) : (
          <span>
            {t("login.dontHaveAccount")}{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setIsRegistering(true)}
            >
              {t("login.registerHere")}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}