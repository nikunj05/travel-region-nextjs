"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { createLoginSchema, LoginFormData } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";
import GoogleLoginIcon from "@/assets/images/google_icon.svg";
import FacebookLoginIcon from "@/assets/images/facebook_icon.svg";
import style from "./Login.module.scss";
import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginForm: React.FC = () => {
  const t = useTranslations("Auth.login");
  const tv = useTranslations("Auth.validation");
  const { handleSubmit, isLoading, error } = useLogin();
  
  const loginSchema = useMemo(() => createLoginSchema((key, params) => {
    if (key === 'passwordMinLength' && params?.min) {
      return tv('passwordMinLength', { min: params.min });
    }
    return tv(key);
  }), [tv]);
  return (
    <>
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
            <p className={style.loginformdesc}>
              {t("formDescription")}
            </p>
            <Form<LoginFormData>
              defaultValues={{
                email: "",
                password: "",
              }}
              onSubmit={handleSubmit}
              schema={loginSchema}
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
              <div className={`${style.loginformGroup} form-group`}>
                <Input
                  name="password"
                  label={t("passwordLabel")}
                  type="password"
                  showPasswordToggle={true}
                  className="form-input form-control"
                  placeholder={t("passwordPlaceholder")}
                  labelClassName={`${style.labelwithfpassword} form-label`}
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
                  {isLoading ? t("signingIn") : t("signInButton")}
                </button>
              </div>
            </Form>
            <div className={style.forgotpass}>
              <Link href="/forgot-password" className={style.forgotpassword}>
                {t("forgotPassword")}
              </Link>
            </div>

            <div className={style.orDivider}>
              <span className={style.orDividerline}></span>
              {t("orSignInWith")}
              <span className={style.orDividerline}></span>
            </div>

            <div className={style.socialLogin}>
              <button
                className={style.socialBtn}
                onClick={() =>
                  signIn("google", {
                    callbackUrl: `/google-auth-success`,
                  })
                }
                type="button"
              >
                <Image
                  src={GoogleLoginIcon}
                  alt="google icon"
                  width="44"
                  height="44"
                  className={style.socialloginicon}
                />
                <span> {t("google")}</span>
              </button>
              <button
                className={style.socialBtn}
                onClick={() =>
                  signIn("facebook", {
                    callbackUrl: `/facebook-auth-success`,
                  })
                }
                type="button"
              >
                <Image
                  src={FacebookLoginIcon}
                  alt="facebook icon"
                  width="44"
                  height="44"
                  className={style.socialloginicon}
                />
                <span>{t("facebook")}</span>
              </button>
            </div>

            <div className={style.logingotosignuplink}>
              <p className={style.signupText}>
                {t("noAccount")} {""}
                <Link href="/register" className={style.signupLink}>
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
