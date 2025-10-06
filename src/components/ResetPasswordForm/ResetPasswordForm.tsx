"use client";

import React, { useEffect, useState } from "react";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { resetPasswordSchema, ResetPasswordFormData } from "@/schemas/resetPasswordSchema";
import { useResetPassword } from "@/hooks/useResetPassword";
import style from "@/components/LoginForm/Login.module.scss";
import Link from "next/link";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";

const ResetPasswordForm: React.FC = () => {
  const { handleSubmit, isLoading, error, initialEmail } = useResetPassword();
  const [mounted, setMounted] = useState(false);

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
          <h1 className={style.loginheadline}>Discover Your Perfect Stay</h1>
          <p className={style.logindescription}>
            Sign in or create an account to manage your bookings and enjoy
            exclusive offers.
          </p>
        </div>
      </div>
      <div className={style.loginrightcontent}>
        <div className={style.loginformBox}>
          <h2 className={style.loginformheading}>Reset Password</h2>
          <p className={style.loginformdesc}>Set a new password for your account</p>
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
                label="Email"
                type="email"
                className="form-input form-control"
                placeholder="Enter your email"
                labelClassName="form-label"
              />
            </div>
            {/* Token is managed from URL and not shown in UI */}
            <div className={`${style.loginformGroup} form-group`}>
              <Input
                name="password"
                label="New Password"
                type="password"
                showPasswordToggle={true}
                className="form-input form-control"
                placeholder="•••••••••••••••••"
                labelClassName="form-label"
              />
            </div>
            <div className={`${style.loginformGroup} form-group`}>
              <Input
                name="password_confirmation"
                label="Confirm Password"
                type="password"
                showPasswordToggle={true}
                className="form-input form-control"
                placeholder="•••••••••••••••••"
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
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </Form>

          <div className={style.logingotosignuplink}>
            <p className={style.signupText}>
              Back to {""}
              <Link href="/login" className={style.signupLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordForm;


