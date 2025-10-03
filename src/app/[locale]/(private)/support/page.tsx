'use client';

import ProfileLayout from '@/components/ProfileLayout/ProfileLayout';

export default function SupportPage() {
  return (
    <ProfileLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>
          Support & Help Center
        </h1>
        <p style={{ color: '#6b7280' }}>
          Get help and support here.
        </p>
      </div>
    </ProfileLayout>
  );
}

