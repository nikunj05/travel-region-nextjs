'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { Form } from '@/components/core/Form/Form';
import { Input } from '@/components/core/Input/Input';
import { profileSchema, ProfileFormData } from '@/schemas/profileSchema';
import { userService } from '@/services/userService';
import { formatApiErrorMessage } from '@/lib/formatApiError';
import { Controller } from 'react-hook-form';
import Image from 'next/image';
import styles from './Profile.module.scss';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [defaultValues, setDefaultValues] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    gender: 'male',
    country_code: '91',
    mobile: '',
    date_of_birth: '',
    nationality: '',
    address: '',
    passport_number: '',
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
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            gender: userData.gender || 'male',
            country_code: userData.country_code || '91',
            mobile: userData.mobile || '',
            date_of_birth: userData.date_of_birth || '',
            nationality: userData.nationality || '',
            address: userData.address || '',
            passport_number: userData.passport_number || '',
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        const errorMessage = formatApiErrorMessage(error) || 'Failed to load profile';
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
      // Ensure optional fields have empty strings instead of undefined
      const profileData = {
        ...data,
        address: data.address || '',
        passport_number: data.passport_number || '',
      };
      const response = await userService.updateProfile(profileData);
      
      if (response.status && response.data.user) {
        // Update user in auth context
        const updatedUser = response.data.user;
        if (setUser) {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        toast.success(response.message || 'Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = formatApiErrorMessage(error) || 'Failed to update profile';
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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
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

  const uploadImage = async () => {
    if (!imageFile) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      // TODO: Replace with actual API endpoint when available
      // const response = await userService.uploadProfileImage(formData);
      
      // Simulated success for now
      // toast.success('Profile image uploaded successfully');
      setImageFile(null);
      
      // If API returns updated user data, update context
      // if (response.data.user) {
      //   setUser(response.data.user);
      //   localStorage.setItem('user', JSON.stringify(response.data.user));
      // }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = formatApiErrorMessage(error) || 'Failed to upload image';
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Auto-upload image when file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  if (isFetching) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <h1>{'Profile'}</h1>
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
        <h1>{'Profile'}</h1>
      </div>

      <div className={styles.profileContent}>
        {/* Profile Image Section */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileAvatar}>
            {profileImage || user?.profile_image ? (
              <div className={styles.avatarImage}>
                <Image
                  src={profileImage || user?.profile_image || ''}
                  alt="Profile"
                  fill
                  className={styles.imagePreview}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className={styles.avatarPlaceholder}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 20C24.1421 20 27.5 16.6421 27.5 12.5C27.5 8.35786 24.1421 5 20 5C15.8579 5 12.5 8.35786 12.5 12.5C12.5 16.6421 15.8579 20 20 20Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 35C7.5 28.0964 13.0964 22.5 20 22.5C26.9036 22.5 32.5 28.0964 32.5 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleImageClick}
              disabled={isUploadingImage}
              aria-label="Upload profile photo"
            >
              {isUploadingImage ? (
                <svg
                  className={styles.spinner}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="32"
                    strokeDashoffset="0"
                  />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
          className={styles.profileForm}
        >
          {(methods) => (
            <>
              <div className={styles.formRow}>
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
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <Controller
                    name="gender"
                    control={methods.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="gender"
                        className={styles.formSelect}
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
                <div className={styles.formGroup}>
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <div className={styles.inputWithIcon}>
                    <Controller
                      name="date_of_birth"
                      control={methods.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          id="date_of_birth"
                          className={styles.formInput}
                        />
                      )}
                    />
                    <span className={styles.inputIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66667 1.66669V4.16669M13.3333 1.66669V4.16669M2.5 7.50002H17.5M4.16667 3.33335H15.8333C16.7538 3.33335 17.5 4.07955 17.5 5.00002V16.6667C17.5 17.5872 16.7538 18.3334 15.8333 18.3334H4.16667C3.24619 18.3334 2.5 17.5872 2.5 16.6667V5.00002C2.5 4.07955 3.24619 3.33335 4.16667 3.33335Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                  {methods.formState.errors.date_of_birth && (
                    <p className={styles.errorMessage}>
                      {methods.formState.errors.date_of_birth.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="nationality">Nationality</label>
                  <div className={styles.inputWithIcon}>
                    <Controller
                      name="nationality"
                      control={methods.control}
                      render={({ field }) => (
                        <select
                          {...field}
                          id="nationality"
                          className={`${styles.formSelect} ${styles.selectWithFlag}`}
                        >
                          <option value="">Select nationality</option>
                          <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                          <option value="India">🇮🇳 India</option>
                          <option value="USA">🇺🇸 USA</option>
                          <option value="UK">🇬🇧 UK</option>
                          <option value="Canada">🇨🇦 Canada</option>
                          <option value="Australia">🇦🇺 Australia</option>
                          <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                        </select>
                      )}
                    />
                  </div>
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
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
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
