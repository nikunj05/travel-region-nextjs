"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { createResetPasswordSchema, ResetPasswordFormData } from "@/schemas/resetPasswordSchema";
import { useResetPassword } from "@/hooks/useResetPassword";
import style from "@/components/LoginForm/Login.module.scss";
import Link from "next/link";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";

const ResetPasswordForm: React.FC = () => {
  const t = useTranslations("Auth.resetPassword");
  const tv = useTranslations("Auth.validation");
  const { handleSubmit, isLoading, error, initialEmail } = useResetPassword();
  const [mounted, setMounted] = useState(false);
  
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema((key, params) => {
    if (key === 'passwordMinLength' && params?.min) {
      return tv('passwordMinLength', { min: params.min });
    }
    return tv(key);
  }), [tv]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={`${style.userLoginPage} loginPage`}>
      <div className={style.leftPanel}>
        <div className={style.loginlogo}>
          <Link className="p-0 m-0" href="/">
            <Image src={travelRegionsLogo} alt="logo" width="205" height="35" />
          </Link>
        </div>
        <div className={style.loginContent}>
          <h1 className={style.loginheadline}>{t("pageTitle")}</h1>
          <p className={style.logindescription}>
            {t("pageDescription")}
          </p>
        </div>
      </div>
      <div className={style.loginrightcontent}>
        <div className={style.loginformBox}>
          <h2 className={style.loginformheading}>{t("formHeading")}</h2>
          <p className={style.loginformdesc}>{t("formDescription")}</p>
          <Form<ResetPasswordFormData>
            defaultValues={{
              email: initialEmail,
              password: "",
              password_confirmation: "",
            }}
            onSubmit={handleSubmit}
            schema={resetPasswordSchema}
            className={`${style.loginformdetails} form-field`}
          >
            <div className={`${style.loginformGroup} form-group`}>
              <Input
                name="email"
                label={t("emailLabel")}
                type="email"
                className="form-input form-control"
                placeholder={t("emailPlaceholder")}
                labelClassName="form-label"
              />
            </div>
            {/* Token is managed from URL and not shown in UI */}
            <div className={`${style.loginformGroup} form-group`}>
              <Input
                name="password"
                label={t("newPasswordLabel")}
                type="password"
                showPasswordToggle={true}
                className="form-input form-control"
                placeholder={t("newPasswordPlaceholder")}
                labelClassName="form-label"
              />
            </div>
            <div className={`${style.loginformGroup} form-group`}>
              <Input
                name="password_confirmation"
                label={t("confirmPasswordLabel")}
                type="password"
                showPasswordToggle={true}
                className="form-input form-control"
                placeholder={t("confirmPasswordPlaceholder")}
                labelClassName="form-label"
              />
            </div>
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
            <div className={style.loginformaction}>
              <button
                type="submit"
                disabled={isLoading}
                className={`${style.loginformbutton} button-primary w-100`}
              >
                {isLoading ? t("resetting") : t("resetButton")}
              </button>
            </div>
          </Form>

          <div className={style.logingotosignuplink}>
            <p className={style.signupText}>
              {t("backTo")} {""}
              <Link href="/login" className={style.signupLink}>
                {t("signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordForm;


