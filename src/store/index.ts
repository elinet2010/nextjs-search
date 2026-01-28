import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import vehicleReducer from './slices/vehicleSlice';
import bookingReducer from './slices/bookingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      search: searchReducer,
      vehicles: vehicleReducer,
      booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignorar fechas en el estado (se serializan automáticamente)
          ignoredActions: ['search/setSearchParams', 'booking/setBooking'],
        },
      }),
  });
};

// Tipos para TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

