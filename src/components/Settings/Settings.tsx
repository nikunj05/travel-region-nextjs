'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Select } from '@/components/core/Select/Select';
import { SelectWithFlag } from '@/components/core/SelectWithFlag/SelectWithFlag';
import { Input } from '@/components/core/Input/Input';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { UpdateUserSettingsRequest } from '@/types/user';
import { COUNTRY_CODES } from '@/constants';
import styles from './Settings.module.scss';

// Import flag images
import EnglishFlag from '@/assets/images/english-flag-icon.svg';
import ArabicFlag from '@/assets/images/arabic-flag-icon.svg';

// Language options with flags
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'American English', flag: EnglishFlag },
  { value: 'ar', label: 'العربية', flag: ArabicFlag },
];

// Currency options with flags
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US$/ U.S. Dollar', flag: EnglishFlag },
  { value: 'EUR', label: '€/ Euro', flag: EnglishFlag },
  { value: 'GBP', label: '£/ British Pound', flag: EnglishFlag },
  { value: 'AED', label: 'د.إ/ UAE Dirham', flag: ArabicFlag },
  { value: 'SAR', label: 'ر.س/ Saudi Riyal', flag: ArabicFlag },
];

// Country code options using the same reference as signup
// const COUNTRY_CODE_OPTIONS = COUNTRY_CODES.map((c) => ({
//   value: c.value,
//   label: `+${c.label}`,
// }));

export default function Settings() {
  const { userSettings, loading, error, updating, updateError, fetchUserSettings, updateUserSettings, clearErrors } = useUserSettingsStore();
  
  const [editingField, setEditingField] = useState<keyof UpdateUserSettingsRequest | null>(null);

  const methods = useForm<UpdateUserSettingsRequest>();
  const { register, setValue, watch, control, } = methods;

  // Fetch user settings on component mount
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  // Update form values when userSettings change
  useEffect(() => {
    if (userSettings) {
      setValue('language', userSettings.language || 'en');
      setValue('currency', userSettings.currency || 'USD');
      setValue('email', userSettings.email);
      setValue('country_code', userSettings.country_code || '971');
      setValue('mobile', userSettings.mobile);
      setValue('password', '');
    }
  }, [userSettings, setValue]);

  const handleEditField = (field: keyof UpdateUserSettingsRequest) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    clearErrors();
  };

  const handleSaveField = async (field: keyof UpdateUserSettingsRequest) => {
    try {
      const currentValues = watch();
      let updateData: UpdateUserSettingsRequest = {
        [field]: currentValues[field],
      };

      // If updating mobile, also include country_code
      if (field === 'mobile') {
        updateData = {
          mobile: currentValues.mobile,
          country_code: currentValues.country_code,
        };
      }

      await updateUserSettings(updateData);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLanguageChange = async (value: string) => {
    try {
      const updateData: UpdateUserSettingsRequest = {
        language: value,
      };
      await updateUserSettings(updateData);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleCurrencyChange = async (value: string) => {
    try {
      const updateData: UpdateUserSettingsRequest = {
        currency: value,
      };
      await updateUserSettings(updateData);
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  const handleCountryCodeChange = async (value: string) => {
    try {
      const currentValues = watch();
      const updateData: UpdateUserSettingsRequest = {
        country_code: value,
        mobile: currentValues.mobile, // Include mobile number as well
      };
      await updateUserSettings(updateData);
    } catch (error) {
      console.error('Error updating country code:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => fetchUserSettings()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.pageTitle}>Settings</h1>

      <FormProvider {...methods}>
        <div className={styles.settingsForm}>
        {/* Language and Currency Preferences Row */}
        <div className={styles.preferencesRow}>
          {/* Language Preferences */}
          <div className={styles.preferenceSection}>
            <h2 className={styles.sectionTitle}>Language Preferences</h2>
            <div className={styles.inputGroup}>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <SelectWithFlag
                    options={LANGUAGE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleLanguageChange(value);
                    }}
                    className={styles.selectField}
                  />
                )}
              />
            </div>
          </div>

          {/* Currency Preferences */}
          <div className={styles.preferenceSection}>
            <h2 className={styles.sectionTitle}>Currency Preferences</h2>
            <div className={styles.inputGroup}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <SelectWithFlag
                    options={CURRENCY_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleCurrencyChange(value);
                    }}
                    className={styles.selectField}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Sign-in & Security */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Sign-in & Security</h2>
          <p className={styles.sectionDescription}>
            Keep your account safe with a secure password and by signing out of devices you&apos;re not using.
          </p>

          {/* Email and Change Password Row */}
          <div className={styles.securityRow}>
            {/* Email Field */}
            <div className={styles.inputGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Email</label>
                <button
                  type="button"
                  className={styles.editLink}
                  onClick={() => editingField === 'email' ? handleSaveField('email') : handleEditField('email')}
                  disabled={updating}
                >
                  {editingField === 'email' ? 'Save' : 'Edit'}
                </button>
              </div>
              <input
                {...register('email')}
                type="email"
                className={styles.inputField}
                disabled={editingField !== 'email'}
              />
              {editingField === 'email' && (
                <div className={styles.editActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Change Password Field */}
            <div className={styles.inputGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Change Password</label>
                <button
                  type="button"
                  className={styles.editLink}
                  onClick={() => editingField === 'password' ? handleSaveField('password') : handleEditField('password')}
                  disabled={updating}
                >
                  {editingField === 'password' ? 'Save' : 'Edit'}
                </button>
              </div>
              <input
                {...register('password')}
                type="password"
                className={styles.inputField}
                placeholder="•••••••••••••••••"
                disabled={editingField !== 'password'}
              />
              {editingField === 'password' && (
                <div className={styles.editActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className={`${styles.inputGroup} form-group select-with-input-field`}>
            <div className={styles.fieldRow}>
              <label className="form-label">Mobile Number</label>
              <button
                type="button"
                className={styles.editLink}
                onClick={() => editingField === 'mobile' ? handleSaveField('mobile') : handleEditField('mobile')}
                disabled={updating}
              >
                {editingField === 'mobile' ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className={`${styles.selectwithinputfield} select-with-input`}>
              <div className={styles.countryCodeInput}>
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={COUNTRY_CODES.map((c) => ({
                        value: c.value,
                        label: `+${c.label}`,
                      }))}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // Only call API update if mobile field is in edit mode
                        if (editingField === 'mobile') {
                          handleCountryCodeChange(value);
                        }
                      }}
                      placeholder="+971"
                      disabled={editingField !== 'mobile'}
                    />
                  )}
                />
              </div>
              <div className={styles.mobileNumberInput}>
                <Input
                  name="mobile"
                  type="number"
                  className="form-input form-control"
                  placeholder="Enter Mobile Number"
                  disabled={editingField !== 'mobile'}
                />
              </div>
            </div>
            {editingField === 'mobile' && (
              <div className={styles.editActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {updateError && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{updateError}</p>
          </div>
        )}

        </div>
      </FormProvider>
    </div>
  );
}
