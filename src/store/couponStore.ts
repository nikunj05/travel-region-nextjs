import { create } from 'zustand';
import { formatApiErrorMessage } from '@/lib/formatApiError';
import { bookingService } from '@/services/bookingService';
import { ApplyCouponRequest, ApplyCouponResponse } from '@/types';
import { toast } from 'react-toastify';

interface CouponState {
    couponCode: string;
    couponResponse: ApplyCouponResponse | null;
    loading: boolean;
    error: string | null;

    setCouponCode: (code: string) => void;
    applyCoupon: (payload: ApplyCouponRequest) => Promise<ApplyCouponResponse | undefined>;
    reset: () => void;
}

export const useCouponStore = create<CouponState>((set) => ({
    couponCode: '',
    couponResponse: null,
    loading: false,
    error: null,

    setCouponCode: (code) => set({ couponCode: code }),

    applyCoupon: async (payload) => {
        set({ loading: true, error: null, couponResponse: null });
        try {
            const response = await bookingService.applyCoupon(payload);
            console.log('Coupon Response:', response);

            set({ couponResponse: response, loading: false });
            return response;
        } catch (error: unknown) {
            console.error('Error applying coupon:', error);
            const errorMessage = formatApiErrorMessage(error);
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    reset: () => set({ couponCode: '', couponResponse: null, loading: false, error: null }),
}));
