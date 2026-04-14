"use client";
import React, { useState, useContext } from "react";
import { Link } from "@/i18/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18/navigation";
import { useLocale } from "next-intl";
import { AuthContext } from "@/context/AuthContext";
import "./LoginModal.scss";
import Image from "next/image";
import ClosePopupIcon from "@/assets/images/close-btn-icon.svg";
import GoogleLoginIcon from "@/assets/images/google_icon.svg";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  returnUrl?: string;
}

const LoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  returnUrl,
}: LoginModalProps) => {
  const t = useTranslations("LoginModal");
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authContext) return;

    setLoading(true);
    try {
      await authContext.login({ email, password });
      // Let parent handle any extra side effects (e.g. booking flow)
      onLoginSuccess();
      toast.success("Logged in successfully!");

      // If a return URL is provided (like booking-review), redirect there
      if (returnUrl) {
        router.replace(returnUrl);
      }

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
    <div className="login-modal-overlay " onClick={onClose}>
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
        <div className="login-modal-body form-field">
          <form onSubmit={handleLogin}>
            <div className="form-group form-group">
              <label className="form-label" htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">{t("password")}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
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
          <button
            type="button"
            className="login-modal-google-btn w-100"
            onClick={() => {
              // Store return URL in sessionStorage before redirecting
              if (returnUrl) {
                sessionStorage.setItem("authReturnUrl", returnUrl);
              }
              signIn("google", {
                callbackUrl: `/${locale}/google-auth-success`,
              });
            }}
          >
            <Image
              src={GoogleLoginIcon}
              alt="google icon"
              width="32"
              height="32"
              className="login-modal-google-icon"
            />
            <span>{t("google")}</span>
          </button>
          <div className="signup-link">
            <p>
              {t("noAccount")}{" "}
              <Link href="/register">{t("signUp")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
