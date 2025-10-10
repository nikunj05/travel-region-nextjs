"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Notification.module.scss";
import { useNotificationStore } from "@/store/notificationStore";
import {
  NewsletterFrequency,
  UpdateNotificationPreferencesRequest,
} from "@/types/notification";

export default function Notification() {
  const t = useTranslations("Notification");
  const {
    preferences,
    loading,
    updating,
    fetchPreferences,
    updatePreferences,
  } = useNotificationStore();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const setNewsletter = async (value: NewsletterFrequency) => {
    const payload: UpdateNotificationPreferencesRequest = { newsletter: value };
    // If preferences not initialized, explicitly send current toggle states as 0 to prevent server defaults
    if (!preferences) {
      payload.travel_blog = 0;
      payload.special_offers = 0;
    }
    await updatePreferences(payload);
  };

  const setToggle = async (
    key: "travel_blog" | "special_offers",
    checked: boolean
  ) => {
    const otherKey: "travel_blog" | "special_offers" =
      key === "travel_blog" ? "special_offers" : "travel_blog";
    const payload: UpdateNotificationPreferencesRequest = {
      [key]: checked ? 1 : 0,
    } as UpdateNotificationPreferencesRequest;
    // If preferences is null or the other value is missing, include explicit 0 for the other field
    const otherValue =
      key === "travel_blog"
        ? preferences?.special_offers
        : preferences?.travel_blog;
    if (!preferences || otherValue === undefined || otherValue === null) {
      payload[otherKey] = 0;
    }
    await updatePreferences(payload);
  };

  const currentNewsletter: NewsletterFrequency | undefined =
    preferences?.newsletter;
  const travelBlogEnabled =
    (preferences?.travel_blog ?? 0) === 1 || preferences?.travel_blog === "1";
  const specialOffersEnabled =
    (preferences?.special_offers ?? 0) === 1 ||
    preferences?.special_offers === "1";

  if (loading) {
    return (
      <div className={styles.notificationContainer}>
        <h1 className={styles.pageTitle}>{t("pageTitle")}</h1>
        <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
          <div>
            <Skeleton height={28} width={150} style={{ marginBottom: "16px" }} />
            <div className={styles.radioGroup}>
              <Skeleton height={24} width={100} style={{ marginBottom: "12px" }} />
              <Skeleton height={24} width={140} style={{ marginBottom: "12px" }} />
              <Skeleton height={24} width={100} style={{ marginBottom: "12px" }} />
              <Skeleton height={24} width={100} />
            </div>
          </div>
          <div style={{ marginTop: "32px" }}>
            <Skeleton height={28} width={180} style={{ marginBottom: "8px" }} />
            <Skeleton height={20} width="80%" style={{ marginBottom: "24px" }} />
            <Skeleton height={80} style={{ marginBottom: "16px", borderRadius: "12px" }} />
            <Skeleton height={80} style={{ borderRadius: "12px" }} />
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div className={styles.notificationContainer}>
      <h1 className={styles.pageTitle}>{t("pageTitle")}</h1>

      <div>
        <h2 className={styles.sectionTitle}>{t("newsletterSection")}</h2>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="checkbox"
              name="newsletter_daily"
              checked={currentNewsletter === "daily"}
              onChange={() => setNewsletter("daily")}
              disabled={loading || updating}
              className={`${styles.checkboxfield} form-check-input`}
            />{" "}
            {t("daily")}
          </label>
          <label>
            <input
              type="checkbox"
              name="newsletter_twice_a_week"
              checked={currentNewsletter === "twice_a_week"}
              onChange={() => setNewsletter("twice_a_week")}
              disabled={loading || updating}
              className={`${styles.checkboxfield} form-check-input`}
            />{" "}
            {t("twiceAWeek")}
          </label>
          <label>
            <input
              type="checkbox"
              name="newsletter_weekly"
              checked={currentNewsletter === "weekly"}
              onChange={() => setNewsletter("weekly")}
              disabled={loading || updating} 
              className={`${styles.checkboxfield} form-check-input`}
            />{" "}
            {t("weekly")}
          </label>
          <label>
            <input
              type="checkbox"
              name="newsletter_never"
              checked={currentNewsletter === "never"}
              onChange={() => setNewsletter("never")}
              disabled={loading || updating}
              className={`${styles.checkboxfield} form-check-input`}
            />{" "}
            {t("never")}
          </label>
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitleEmail}>{t("emailPreferencesSection")}</h2>
        <p className={styles.emailNote}>
          {t("emailNote")}
        </p>

        <div className={styles.toggleCard}>
          <div>
            <div className={styles.toggleTitle}>{t("travelBlogTitle")}</div>
            <div className={styles.toggleDescription}>
              {t("travelBlogDescription")}
            </div>
          </div>
          <input
            className={styles.toggle}
            type="checkbox"
            checked={travelBlogEnabled}
            onChange={(e) => setToggle("travel_blog", e.target.checked)}
            disabled={loading || updating}
          />
        </div>

        <div className={styles.toggleCard}>
          <div>
            <div className={styles.toggleTitle}>{t("specialOffersTitle")}</div>
            <div className={styles.toggleDescription}>
              {t("specialOffersDescription")}
            </div>
          </div>
          <input
            className={styles.toggle}
            type="checkbox"
            checked={specialOffersEnabled}
            onChange={(e) => setToggle("special_offers", e.target.checked)}
            disabled={loading || updating}
          />
        </div>
      </div>
    </div>
  );
}
