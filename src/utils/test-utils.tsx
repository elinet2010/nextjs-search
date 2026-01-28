import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import type { RootState, AppStore } from '@/store';
import searchSlice from '@/store/slices/searchSlice';
import vehicleSlice from '@/store/slices/vehicleSlice';
import bookingSlice from '@/store/slices/bookingSlice';

// Esta función crea un store de Redux para testing
export function createTestStore(preloadedState?: PreloadedState<RootState>): AppStore {
  return configureStore({
    reducer: {
      search: searchSlice,
      vehicles: vehicleSlice,
      booking: bookingSlice,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'search/setSearchParams',
            'vehicles/setVehicles',
            'booking/setBooking',
            'vehicles/search/fulfilled',
            'vehicles/fetchById/fulfilled',
          ],
          ignoredPaths: [
            'search.params.pickupDate',
            'search.params.returnDate',
            'vehicles.items',
            'vehicles.selectedVehicle',
            'booking.currentBooking.searchParams.pickupDate',
            'booking.currentBooking.searchParams.returnDate',
            'booking.currentBooking.vehicle',
          ],
        },
      }),
  });
}

// Helper para renderizar componentes con Redux Provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-exportar todo de @testing-library/react
export * from '@testing-library/react';

