'use client';

import ProfileLayout from '@/components/ProfileLayout/ProfileLayout';

export default function SettingsPage() {
  return (
    <ProfileLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your account settings here.
        </p>
      </div>
    </ProfileLayout>
  );
}

