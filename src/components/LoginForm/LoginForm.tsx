"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
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
  const nav = useTranslations("Navigation");
  const { handleSubmit, isLoading, error } = useLogin();
  return (
    <>
      <main className={`${style.userLoginPage} loginPage`}>
        <div className={style.leftPanel}>
          <div className={style.loginlogo}>
            <a className="p-0 m-0" href="/">
              <Image
                src={travelRegionsLogo}
                alt="logo"
                width="205"
                height="35"
              />
            </a>
          </div>
          <div className={style.loginContent}>
            <h1 className={style.loginheadline}>Discover Your Perfect Stay</h1>
            <p className={style.logindescription}>
              Sign in or create an account to manage your bookings and enjoy
              exclusive offers.
            </p>
          </div>
        </div>

        <div className={style.loginrightcontent}>
          <div className={style.loginformBox}>
            <h2 className={style.loginformheading}>Please Sign in</h2>
            <p className={style.loginformdesc}>
              You need to Sign in first to continue
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
                  label="Email"
                  type="email"
                  className="form-input form-control"
                  placeholder="example@gmail.com"
                  labelClassName="form-label"
                />
              </div>
              <div className={`${style.loginformGroup} form-group`}>
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  showPasswordToggle={true}
                  className="form-input form-control"
                  placeholder="•••••••••••••••••"
                  labelClassName={`${style.labelwithfpassword} form-label`}
                  required
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
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </Form>
            <div className={style.forgotpass}>
              <Link href="/forgot-password" className={style.forgotpassword}>
                Forgot Password?
              </Link>
            </div>

            <div className={style.orDivider}>
              <span className={style.orDividerline}></span>
              Or Sign in with
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
                <span> Google</span>
              </button>
              <button className={style.socialBtn}>
                <Image
                  src={FacebookLoginIcon}
                  alt="facebook icon"
                  width="44"
                  height="44"
                  className={style.socialloginicon}
                />
                <span>Facebook</span>
              </button>
            </div>

            <div className={style.logingotosignuplink}>
              <p className={style.signupText}>
                Don’t have an account? {""}
                <Link href="/register" className={style.signupLink}>
                  Sign up
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
