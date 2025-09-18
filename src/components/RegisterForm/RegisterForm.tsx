"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";
import GoogleLoginIcon from "@/assets/images/google_icon.svg";
import FacebookLoginIcon from "@/assets/images/facebook_icon.svg";
import EyeIconHide from "@/assets/images/eye-hide-icon.svg";
import style from "./RegisterForm.module.scss";

const RegisterForm: React.FC = () => {
  const t = useTranslations("Auth.login");
  const nav = useTranslations("Navigation");
  const { handleSubmit, isLoading, error } = useLogin();

  const defaultValues: LoginFormData = {
    email: "",
    password: "",
  };

  return (
    <>
      <main className={`${style.userLoginPage} loginPage`}>
        <div className={style.leftPanel}>
          <div className={style.loginlogo}>
            <a className="p-0 m-0" href="#">
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
            <form className={`${style.loginformdetails} form-field`}>
              <div className={`${style.loginformGroup} form-group`}>
                <label className="form-label" htmlFor="loginEmailField">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input form-control"
                  placeholder="example@gmail.com"
                  id="loginEmailField"
                />
              </div>
              <div className={`${style.loginformGroup} form-group`}>
                <label
                  className={`${style.labelwithfpassword} form-label`}
                  htmlFor="loginPassField"
                >
                  Password
                  <a href="#" className={style.forgotpassword}>
                    Forgot Password?
                  </a>
                </label>
                <div className={style.passwordwithicon}>
                  <input
                    type="password"
                    className="form-input form-control"
                    placeholder="•••••••••••••••••"
                    required
                    id="loginPassField"
                  />
                  <a className={style.passwordeyeicon}>
                    <Image
                      src={EyeIconHide}
                      alt="eye icon"
                      width="24"
                      height="24"
                      className={style.passeyeicon}
                    />
                  </a>
                </div>
              </div>
              <div className={style.loginformaction}>
                <button
                  type="submit"
                  className={`${style.loginformbutton} button-primary w-100`}
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className={style.orDivider}>
              <span className={style.orDividerline}></span>
              Or Sign in with
              <span className={style.orDividerline}></span>
            </div>

            <div className={style.socialLogin}>
              <button className={style.socialBtn}>
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
                <a href="#" className={style.signupLink}>
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterForm;
