import { create } from 'zustand';
import { bookingService } from '@/services/bookingService';
import { ApplyCouponRequest, ApplyCouponResponse } from '@/types';
import { toast } from 'react-toastify';

interface CouponState {
    couponCode: string;
    couponResponse: ApplyCouponResponse | null;
    loading: boolean;
    error: string | null;

    setCouponCode: (code: string) => void;
    applyCoupon: (payload: ApplyCouponRequest) => Promise<void>;
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

            if (response.status) {
                toast.success(response.message || 'Coupon applied successfully');
            } else {
                toast.error(response.message || 'Failed to apply coupon');
            }
        } catch (error: any) {
            console.error('Error applying coupon:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Error applying coupon';
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    reset: () => set({ couponCode: '', couponResponse: null, loading: false, error: null }),
}));
