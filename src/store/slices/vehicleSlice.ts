import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle } from '@/domain/entities/Vehicle';

interface VehicleState {
  items: Vehicle[];
  selectedVehicleId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  items: [],
  selectedVehicleId: null,
  isLoading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.items = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    selectVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicleId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearVehicles: (state) => {
      state.items = [];
      state.selectedVehicleId = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setVehicles,
  selectVehicle,
  setLoading,
  setError,
  clearVehicles,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;

