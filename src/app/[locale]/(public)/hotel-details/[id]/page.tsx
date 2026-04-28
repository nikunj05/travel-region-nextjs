import HotelDetails from '@/components/HotelDetails/HotelDetails';
import { use } from 'react';

export default function HotelDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ n?: string; a?: string; img?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const hotelParam = resolvedParams.id;
  const slugParts = hotelParam?.split("-").filter(Boolean) ?? [];
  const derivedHotelId =
    slugParts.length > 1 ? slugParts[slugParts.length - 1] : hotelParam;

  return (
    <HotelDetails
      hotelId={derivedHotelId}
      initialName={resolvedSearchParams.n}
      initialAddress={resolvedSearchParams.a}
      initialImage={resolvedSearchParams.img}
    />
  );
}