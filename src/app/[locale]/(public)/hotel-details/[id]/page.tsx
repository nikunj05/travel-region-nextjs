import HotelDetails from '@/components/HotelDetails/HotelDetails';
import { use } from 'react';

export default function HotelDetailsPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
  const resolvedParams = use(params);
  const hotelParam = resolvedParams.id;
  const slugParts = hotelParam?.split('-').filter(Boolean) ?? [];
  const derivedHotelId =
    slugParts.length > 1 ? slugParts[slugParts.length - 1] : hotelParam;

  return (
    <HotelDetails hotelId={derivedHotelId} />
  )
}