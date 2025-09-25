"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { registerSchema, RegisterFormData } from "@/schemas/registerSchema";
import { useRegister } from "@/hooks/useRegister";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { Select } from "@/components/core/Select/Select";
import { COUNTRY_CODES } from "@/constants";
import Image from "next/image";
import travelRegionsLogo from "@/assets/images/travel-regions-logo.svg";
import GoogleLoginIcon from "@/assets/images/google_icon.svg";
import FacebookLoginIcon from "@/assets/images/facebook_icon.svg";
import style from "./RegisterForm.module.scss";
import Link from "next/link";

const RegisterForm: React.FC = () => {
  const t = useTranslations("Auth.login");
  const nav = useTranslations("Navigation");
  const { handleSubmit, isLoading, error, success } = useRegister();

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
            <h2 className={style.loginformheading}>Create an account</h2>
            <p className={style.loginformdesc}>
              Create an account and get the Deals & Promotions news
            </p>
            <Form<RegisterFormData>
              defaultValues={{
                first_name: "",
                last_name: "",
                email: "",
                country_code: "971",
                mobile: "",
                password: "",
              }}
              onSubmit={handleSubmit}
              schema={registerSchema}
              className={`${style.loginformdetails} form-field`}
            >
              {(methods) => (
                <>
                  <div className={`${style.loginformGroup} form-group`}>
                    <div className={style.mobileInputGroup}>
                      <div className={`${style.loginformGroup}`}>
                        <Input
                          name="first_name"
                          label="First Name"
                          type="text"
                          className="form-input form-control"
                          placeholder="Enter your first name"
                          labelClassName="form-label"
                        />
                      </div>
                      <div className={`${style.loginformGroup} form-group`}>
                        <Input
                          name="last_name"
                          label="Last Name"
                          type="text"
                          className="form-input form-control"
                          placeholder="Enter your last name"
                          labelClassName="form-label"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${style.loginformGroup} form-group`}>
                    <div className={style.mobileInputGroup}>
                      <div className={`${style.loginformGroup} `}>
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
                          labelClassName="form-label"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.loginformGroup} form-group select-with-input-field`}
                  >
                    <label className="form-label">Mobile Number</label>
                    <div
                      className={`${style.selectwithinputfield} select-with-input`}
                    >
                      <div className={style.countryCodeInput}>
                        <Controller
                          name="country_code"
                          control={methods.control}
                          render={({ field }) => (
                            <Select
                              options={COUNTRY_CODES.map((c) => ({
                                value: c.value,
                                label: `+${c.label}`,
                              }))}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="+971"
                            />
                          )}
                        />
                      </div>
                      <div className={style.mobileNumberInput}>
                        <Input
                          name="mobile"
                          type="number"
                          className="form-input form-control"
                          placeholder="Enter Mobile Number"
                        />
                      </div>
                    </div>
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
                      {isLoading ? "Signing up..." : "Sign up"}
                    </button>
                  </div>
                </>
              )}
            </Form>

            <div className={style.orDivider}>
              <span className={style.orDividerline}></span>
              Or Sign up with
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
                Already have an account? {""}
                <Link href="/login" className={style.signupLink}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterForm;
