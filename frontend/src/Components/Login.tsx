import React, { useState, ChangeEvent, FormEvent, JSX } from "react";
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

  const handleAuth = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          alert(t("login.passwordsDoNotMatch"));
          return;
        }

        const response = await API.post<AuthResponse>("/users/register", {
          username,
          email: normalizedEmail,
          password,
          confirm_password: confirmPassword,
        });

        const loggedInUser: User = {
          username: response.data.username || username,
          email: response.data.email || normalizedEmail,
        };

        setCurrentUser(loggedInUser);
        navigate("/");
        alert(t("login.accountCreated"));
        
      } else {
        const response = await API.post<AuthResponse>("/users/login", {
          email: normalizedEmail,
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

      const detail = error.response?.data?.detail;
      const errorDetail = Array.isArray(detail)
        ? detail
            .map(
              (item: { loc?: Array<string | number>; msg?: string }) =>
                `${item.loc?.slice(-1)[0] ?? "Request"}: ${item.msg ?? "Invalid value"}`,
            )
            .join("\n")
        : typeof detail === "string"
          ? detail
          : t("login.authenticationFailed");

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

      <form
        onSubmit={handleAuth}
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
            required
            style={{ padding: "10px" }}
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
          required
          style={{ padding: "10px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          required
          style={{ padding: "10px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        {isRegistering && (
          <input
            type="password"
            placeholder={t("login.confirmPassword")}
            value={confirmPassword}
            required
            style={{ padding: "10px" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        )}

        <button type="submit">
          {isRegistering
            ? t("login.registerButton")
            : t("login.loginButton")}
        </button>
      </form>

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
