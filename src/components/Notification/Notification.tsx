"use client";

import React, { useEffect } from "react";
import styles from "./Notification.module.scss";
import { useNotificationStore } from "@/store/notificationStore";
import {
  NewsletterFrequency,
  UpdateNotificationPreferencesRequest,
} from "@/types/notification";

export default function Notification() {
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

  return (
    <div className={styles.notificationContainer}>
      <h1 className={styles.pageTitle}>Notifications</h1>

      <div>
        <h2 className={styles.sectionTitle}>Newsletter</h2>
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
            Daily
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
            Twice a week
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
            Weekly
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
            Never
          </label>
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitleEmail}>Email Preferences</h2>
        <p className={styles.emailNote}>
          We&apos;ll send the selected emails to your account email.
        </p>

        <div className={styles.toggleCard}>
          <div>
            <div className={styles.toggleTitle}>Travel Blog</div>
            <div className={styles.toggleDescription}>
              A monthly update one the the latest travel trips, trick, and
              trends.
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
            <div className={styles.toggleTitle}>Special Offers</div>
            <div className={styles.toggleDescription}>
              Get special and limited-time deals.
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
