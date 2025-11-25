import React, { use } from "react";
import BookingConfirmationComp from "@/components/BookingConfirmation/BookingConfirmation";

export default function BookingConfirmationWithId({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  return (
    <>
      <BookingConfirmationComp bookingId={bookingId} />
    </>
  );
}

