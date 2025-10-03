'use client';

import ProfileLayout from '@/components/ProfileLayout/ProfileLayout';

export default function PaymentMethodsPage() {
  return (
    <ProfileLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>
          Payment Methods
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your payment methods here.
        </p>
      </div>
    </ProfileLayout>
  );
}

