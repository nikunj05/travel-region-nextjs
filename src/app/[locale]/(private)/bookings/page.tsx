'use client';

import ProfileLayout from '@/components/ProfileLayout/ProfileLayout';

export default function BookingsPage() {
  return (
    <ProfileLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>
          My Bookings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Your booking history will appear here.
        </p>
      </div>
    </ProfileLayout>
  );
}

