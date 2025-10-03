'use client';

import ProfileLayout from '@/components/ProfileLayout/ProfileLayout';

export default function NotificationPage() {
  return (
    <ProfileLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>
          Notifications
        </h1>
        <p style={{ color: '#6b7280' }}>
          Your notifications will appear here.
        </p>
      </div>
    </ProfileLayout>
  );
}

