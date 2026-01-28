import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState, AppStore } from '@/store';
import searchReducer from '@/store/slices/searchSlice';
import vehicleReducer from '@/store/slices/vehicleSlice';
import bookingReducer from '@/store/slices/bookingSlice';

// Tipo para preloadedState
type PreloadedState = Partial<RootState>;

// Esta función crea un store de Redux para testing
export function createTestStore(preloadedState?: PreloadedState): AppStore {
  const storeConfig: Parameters<typeof configureStore>[0] = {
    reducer: {
      search: searchReducer,
      vehicles: vehicleReducer,
      booking: bookingReducer,
    },
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
  };

  if (preloadedState && Object.keys(preloadedState).length > 0) {
    storeConfig.preloadedState = preloadedState as any;
  }

  return configureStore(storeConfig) as AppStore;
}

// Helper para renderizar componentes con Redux Provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
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

