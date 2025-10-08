"use client";

import ProfileLayout from "@/components/ProfileLayout/ProfileLayout";
import Image from "next/image";
import NoCardSavedImage from "@/assets/images/no-card-save-image.png";
import "./payment-method.scss";

export default function PaymentMethodsPage() {
  return (
    <ProfileLayout>
      <div className="payment-methods-page">
        <h1 className="payment-methods-title">Payment Methods</h1>
        {/* <p style={{ color: '#6b7280' }}>
          Manage your payment methods here.
        </p> */}

        <div className="no-save-card-screen">
          <h3 className="no-save-card-title">No Saved Cards</h3>
          <Image
            src={NoCardSavedImage}
            alt="card image"
            width={285}
            height={168}
            className="no-save-card-image"
          />
        </div>
      </div>
    </ProfileLayout>
  );
}
