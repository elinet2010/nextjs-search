import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Booking } from '@/domain/entities/Booking';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';

interface BookingState {
  booking: Booking | null;
  isConfirmed: boolean;
}

const initialState: BookingState = {
  booking: null,
  isConfirmed: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBooking: (
      state,
      action: PayloadAction<{
        vehicle: Vehicle;
        searchParams: SearchParams;
        totalPrice: number;
      }>
    ) => {
      const { vehicle, searchParams, totalPrice } = action.payload;
      const days =
        Math.ceil(
          (searchParams.returnDate.getTime() -
            searchParams.pickupDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) || 1;

      state.booking = {
        id: `booking-${Date.now()}`,
        vehicle,
        searchParams,
        totalPrice,
        days,
        createdAt: new Date(),
      };
      state.isConfirmed = false;
    },
    confirmBooking: (state) => {
      if (state.booking) {
        state.isConfirmed = true;
      }
    },
    clearBooking: (state) => {
      state.booking = null;
      state.isConfirmed = false;
    },
  },
});

export const { setBooking, confirmBooking, clearBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;


