"use client";

import ProfileLayout from "@/components/ProfileLayout/ProfileLayout";
import Image from "next/image";
import NoCardSavedImage from "@/assets/images/no-card-save-image.png";
import { useTranslations } from "next-intl";
import "./PaymentMethods.scss";

export default function PaymentMethods() {
  const t = useTranslations("PaymentMethods");

  return (
    <ProfileLayout>
      <div className="payment-methods-page">
        <h1 className="payment-methods-title">{t("pageTitle")}</h1>

        <div className="no-save-card-screen">
          <h3 className="no-save-card-title">{t("noSavedCards")}</h3>
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


