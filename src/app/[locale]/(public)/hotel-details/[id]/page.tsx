import HotelDetails from '@/components/HotelDetails/HotelDetails';
import { use } from 'react';

export default function HotelDetailsPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const resolvedParams = use(params);
  return (
    <HotelDetails hotelId={resolvedParams.id} />
  )
}