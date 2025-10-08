"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Form } from "@/components/core/Form/Form";
import { Input } from "@/components/core/Input/Input";
import { SelectWithFlag } from "@/components/core/SelectWithFlag/SelectWithFlag";
import { profileSchema, ProfileFormData } from "@/schemas/profileSchema";
import { userService } from "@/services/userService";
import { formatApiErrorMessage } from "@/lib/formatApiError";
import { Controller } from "react-hook-form";
import Image from "next/image";
import styles from "./Profile.module.scss";

// Import flag images for nationality
import UAEFlag from "@/assets/images/arabic-flag-icon.svg";
import IndiaFlag from "@/assets/images/english-flag-icon.svg";
import USAFlag from "@/assets/images/english-flag-icon.svg";
import UKFlag from "@/assets/images/english-flag-icon.svg";
import CanadaFlag from "@/assets/images/english-flag-icon.svg";
import AustraliaFlag from "@/assets/images/english-flag-icon.svg";
import SaudiFlag from "@/assets/images/arabic-flag-icon.svg";

// Nationality options with flags
const NATIONALITY_OPTIONS = [
  {
    value: "United Arab Emirates",
    label: "United Arab Emirates",
    flag: UAEFlag,
  },
  { value: "India", label: "India", flag: IndiaFlag },
  { value: "USA", label: "USA", flag: USAFlag },
  { value: "UK", label: "UK", flag: UKFlag },
  { value: "Canada", label: "Canada", flag: CanadaFlag },
  { value: "Australia", label: "Australia", flag: AustraliaFlag },
  { value: "Saudi Arabia", label: "Saudi Arabia", flag: SaudiFlag },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [defaultValues, setDefaultValues] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    gender: "male",
    country_code: "91",
    mobile: "",
    date_of_birth: "",
    nationality: "",
    address: "",
    passport_number: "",
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const response = await userService.getProfile();

        if (response.status && response.data.user) {
          const userData = response.data.user;
          setDefaultValues({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            gender: userData.gender || "male",
            country_code: userData.country_code || "91",
            mobile: userData.mobile || "",
            date_of_birth: userData.date_of_birth || "",
            nationality: userData.nationality || "",
            address: userData.address || "",
            passport_number: userData.passport_number || "",
          });

          // Set profile image URL if available
          if (userData.profile_image_url) {
            setProfileImage(userData.profile_image_url);
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
        const errorMessage =
          formatApiErrorMessage(error) || "Failed to load profile";
        toast.error(errorMessage);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);

      // Prepare form data
      const formData = new FormData();

      // Add all form fields
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("gender", data.gender);
      formData.append("country_code", data.country_code);
      formData.append("mobile", data.mobile);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("nationality", data.nationality);
      formData.append("address", data.address || "");
      formData.append("passport_number", data.passport_number || "");

      // Add image file if selected
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const response = await userService.updateProfile(formData);

      if (response.status && response.data.user) {
        // Update user in auth context
        const updatedUser = response.data.user;
        if (setUser) {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // Update profile image URL if available
        if (updatedUser.profile_image_url) {
          setProfileImage(updatedUser.profile_image_url);
        }

        // Clear image file after successful upload
        setImageFile(null);

        toast.success(response.message || "Profile updated successfully");
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage =
        formatApiErrorMessage(error) || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove auto-upload - image will be uploaded with form submission

  if (isFetching) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <h1>{"Profile"}</h1>
        </div>
        <div className={styles.loadingState}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <h1>{"Profile"}</h1>
      </div>

      <div className={styles.profileContent}>
        {/* Profile Image Section */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileAvatar}>
            {profileImage || user?.profile_image_url ? (
              <div className={styles.avatarImage}>
                <Image
                  src={profileImage || user?.profile_image_url || ""}
                  alt="Profile"
                  fill
                  className={styles.imagePreview}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className={styles.avatarPlaceholder}>
                <svg
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.8474 22.8019C28.0247 22.9075 28.2436 23.031 28.4915 23.1708C29.5777 23.7836 31.2196 24.7099 32.3444 25.8109C33.0479 26.4995 33.7163 27.4069 33.8379 28.5186C33.9671 29.7009 33.4513 30.8103 32.4166 31.7961C30.6316 33.4967 28.4894 34.8596 25.7187 34.8596H12.2813C9.51056 34.8596 7.36841 33.4967 5.58335 31.7961C4.54865 30.8103 4.0329 29.7009 4.16213 28.5186C4.28364 27.4069 4.95207 26.4995 5.65556 25.8109C6.78039 24.7099 8.42231 23.7836 9.5085 23.1708C9.75636 23.031 9.97531 22.9075 10.1525 22.8019C15.5682 19.5772 22.4317 19.5772 27.8474 22.8019Z"
                    fill="#3E5B96"
                  />
                  <path
                    d="M11 10.0977C11 5.67938 14.5817 2.09766 19 2.09766C23.4183 2.09766 27 5.67938 27 10.0977C27 14.5159 23.4183 18.0977 19 18.0977C14.5817 18.0977 11 14.5159 11 10.0977Z"
                    fill="#3E5B96"
                  />
                </svg>
              </div>
            )}
            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleImageClick}
              aria-label="Upload profile photo"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_462_8850)">
                  <path
                    d="M4.66732 4C3.85356 4.00244 3.4032 4.02191 3.03314 4.17723C2.51479 4.3948 2.09266 4.79669 1.84605 5.3074C1.64477 5.72425 1.61183 6.25833 1.54596 7.32649L1.44273 9.0003C1.27891 11.6566 1.197 12.9847 1.97644 13.8255C2.75588 14.6663 4.069 14.6663 6.69523 14.6663H9.30607C11.9323 14.6663 13.2454 14.6663 14.0249 13.8255C14.8043 12.9847 14.7224 11.6566 14.5586 9.0003L14.4553 7.32649C14.3895 6.25833 14.3565 5.72425 14.1552 5.3074C13.9086 4.79669 13.4865 4.3948 12.9682 4.17723C12.5981 4.02191 12.1477 4.00244 11.334 4"
                    stroke="white"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.3327 4.66536L10.7421 3.18898C10.4873 2.55201 10.2656 1.82943 9.61045 1.50507C9.26095 1.33203 8.84042 1.33203 7.99935 1.33203C7.15828 1.33203 6.73775 1.33203 6.38825 1.50507C5.73309 1.82943 5.51136 2.55201 5.25657 3.18899L4.66602 4.66536"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.3327 9.33333C10.3327 10.622 9.28801 11.6667 7.99935 11.6667C6.71068 11.6667 5.66602 10.622 5.66602 9.33333C5.66602 8.04467 6.71068 7 7.99935 7C9.28801 7 10.3327 8.04467 10.3327 9.33333Z"
                    stroke="white"
                  />
                  <path
                    d="M7.99987 4H8.00586"
                    stroke="white"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_462_8850">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className={styles.fileInput}
              aria-label="Upload profile image"
            />
          </div>
        </div>

        {/* Profile Form */}
        <Form
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          schema={profileSchema}
          className={`${styles.profileForm} form-field`}
        >
          {(methods) => (
            <>
              <div className={`${styles.formRow} `}>
                <Input
                  name="first_name"
                  label="First Name"
                  placeholder="Enter first name"
                  className={styles.formInput}
                />
                <Input
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter last name"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} form-group`}>
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <Controller
                    name="gender"
                    control={methods.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="gender"
                        className={`${styles.formSelect} form-input`}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    )}
                  />
                  {methods.formState.errors.gender && (
                    <p className={styles.errorMessage}>
                      {methods.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <Input
                  name="mobile"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} form-group`}>
                  <label htmlFor="date_of_birth" className="form-label">
                    Date of Birth
                  </label>
                  <Controller
                    name="date_of_birth"
                    control={methods.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        id="date_of_birth"
                        className={`${styles.formInput} form-input`}
                      />
                    )}
                  />
                  {methods.formState.errors.date_of_birth && (
                    <p className={styles.errorMessage}>
                      {methods.formState.errors.date_of_birth.message}
                    </p>
                  )}
                </div>

                <div className={`${styles.formGroup} form-group`}>
                  <label htmlFor="nationality" className="form-label">
                    Nationality
                  </label>
                  <Controller
                    name="nationality"
                    control={methods.control}
                    render={({ field }) => (
                      <SelectWithFlag
                        options={NATIONALITY_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select nationality"
                      />
                    )}
                  />
                  {methods.formState.errors.nationality && (
                    <p className={styles.errorMessage}>
                      {methods.formState.errors.nationality.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <Input
                  name="address"
                  label="Address(optional)"
                  placeholder="Enter address"
                  className={styles.formInput}
                />
                <Input
                  name="passport_number"
                  label="Passport number(optional)"
                  placeholder="Enter passport number"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={`${styles.saveButton} button-primary w-100`}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Profile;
