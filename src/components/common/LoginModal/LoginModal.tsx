"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthContext } from "@/context/AuthContext";
import "./LoginModal.scss";
import Image from "next/image";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import { toast } from "react-toastify";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const t = useTranslations("LoginModal");
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authContext) return;

    setLoading(true);
    try {
      await authContext.login({ email, password });
      onLoginSuccess();
      toast.success("Logged in successfully!");
      onClose();
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header d-flex align-items-center">
          <button className="login-modal-close p-0" onClick={onClose}>
            <Image
              src={ClosePopupIcon}
              width={24}
              height={24}
              alt="close icon"
            />
          </button>
          <h2 className="login-modal-title">{t("title")}</h2>
        </div>
        <div className="login-modal-body">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t("password")}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="button-primary w-100"
              disabled={loading}
            >
              {loading ? t("loading") : t("loginButton")}
            </button>
          </form>
          <div className="signup-link">
            <p>
              {t("noAccount")}{" "}
              <Link href="/signup">{t("signUp")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
