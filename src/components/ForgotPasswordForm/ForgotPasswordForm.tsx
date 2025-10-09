"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { createForgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/forgotPasswordSchema";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import style from "@/components/LoginForm/Login.module.scss";
import Link from "next/link";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";

const ForgotPasswordForm: React.FC = () => {
  const t = useTranslations("Auth.forgotPassword");
  const tv = useTranslations("Auth.validation");
  const { handleSubmit, isLoading, error } = useForgotPassword();
  
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema((key) => tv(key)), [tv]);

  return (
    <main className={`${style.userLoginPage} loginPage`}>
      <div className={style.leftPanel}>
        <div className={style.loginlogo}>
          <Link className="p-0 m-0" href="/">
            <Image
              src={travelRegionsLogo}
              alt="logo"
              width="205"
              height="35"
            />
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
          <Form<ForgotPasswordFormData>
            defaultValues={{ email: "" }}
            onSubmit={handleSubmit}
            schema={forgotPasswordSchema}
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
            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}
            <div className={style.loginformaction}>
              <button
                type="submit"
                disabled={isLoading}
                className={`${style.loginformbutton} button-primary w-100`}
              >
                {isLoading ? t("sending") : t("sendButton")}
              </button>
            </div>
          </Form>

          <div className={style.logingotosignuplink}>
            <p className={style.signupText}>
              {t("rememberedPassword")} {""}
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

export default ForgotPasswordForm;



// data
// : 
// {,…}
// reset_link
// : 
// "https://phpstack-1497927-5868931.cloudwaysapps.com/reset-password/vjAjqeTYuT8Y5llrmZmxErW3z5hAfqNJZ2eLHRxRENzuGJxZf21wamnqFyLD?email=ranjit111@yopmail.com"
// message
// : 
// "Password reset link has been sent to your email."
// status
// : 
// true