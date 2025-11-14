import React, { use } from "react";
import BookingReviewPage from "@/components/BookingReview/BookingReview";

export default function BookingReview({
  params,
}: {
  params: Promise<{ hotelId: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const hotelId = resolvedParams.hotelId;

  return (
    <>
      <BookingReviewPage hotelId={hotelId} />
    </>
  );
}

