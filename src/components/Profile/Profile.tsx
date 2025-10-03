'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { Form } from '@/components/core/Form/Form';
import { Input } from '@/components/core/Input/Input';
import { SelectWithFlag } from '@/components/core/SelectWithFlag/SelectWithFlag';
import { profileSchema, ProfileFormData } from '@/schemas/profileSchema';
import { userService } from '@/services/userService';
import { formatApiErrorMessage } from '@/lib/formatApiError';
import { Controller } from 'react-hook-form';
import Image from 'next/image';
import styles from './Profile.module.scss';

// Import flag images for nationality
import UAEFlag from '@/assets/images/arabic-flag-icon.svg';
import IndiaFlag from '@/assets/images/english-flag-icon.svg';
import USAFlag from '@/assets/images/english-flag-icon.svg';
import UKFlag from '@/assets/images/english-flag-icon.svg';
import CanadaFlag from '@/assets/images/english-flag-icon.svg';
import AustraliaFlag from '@/assets/images/english-flag-icon.svg';
import SaudiFlag from '@/assets/images/arabic-flag-icon.svg';

// Nationality options with flags
const NATIONALITY_OPTIONS = [
  { value: 'United Arab Emirates', label: 'United Arab Emirates', flag: UAEFlag },
  { value: 'India', label: 'India', flag: IndiaFlag },
  { value: 'USA', label: 'USA', flag: USAFlag },
  { value: 'UK', label: 'UK', flag: UKFlag },
  { value: 'Canada', label: 'Canada', flag: CanadaFlag },
  { value: 'Australia', label: 'Australia', flag: AustraliaFlag },
  { value: 'Saudi Arabia', label: 'Saudi Arabia', flag: SaudiFlag },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
          
          // Set profile image URL if available
          if (userData.profile_image_url) {
            setProfileImage(userData.profile_image_url);
          }
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
      
      // Prepare form data
      const formData = new FormData();
      
      // Add all form fields
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('gender', data.gender);
      formData.append('country_code', data.country_code);
      formData.append('mobile', data.mobile);
      formData.append('date_of_birth', data.date_of_birth);
      formData.append('nationality', data.nationality);
      formData.append('address', data.address || '');
      formData.append('passport_number', data.passport_number || '');
      
      // Add image file if selected
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }
      
      const response = await userService.updateProfile(formData);
      
      if (response.status && response.data.user) {
        // Update user in auth context
        const updatedUser = response.data.user;
        if (setUser) {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // Update profile image URL if available
        if (updatedUser.profile_image_url) {
          setProfileImage(updatedUser.profile_image_url);
        }
        
        // Clear image file after successful upload
        setImageFile(null);
        
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

  // Remove auto-upload - image will be uploaded with form submission

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
            {profileImage || user?.profile_image_url ? (
              <div className={styles.avatarImage}>
                <Image
                  src={profileImage || user?.profile_image_url || ''}
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
              aria-label="Upload profile photo"
            >
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
                  {methods.formState.errors.date_of_birth && (
                    <p className={styles.errorMessage}>
                      {methods.formState.errors.date_of_birth.message}
                    </p>
                  )}
                </div>

                 <div className={styles.formGroup}>
                   <label htmlFor="nationality">Nationality</label>
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
