import { configureStore } from '@reduxjs/toolkit';
import { searchVehicles } from '../searchThunks';
import type { SearchParams } from '@/domain/entities/SearchParams';
import type { Vehicle } from '@/domain/entities/Vehicle';
import searchSlice from '@/store/slices/searchSlice';
import vehicleSlice from '@/store/slices/vehicleSlice';

// Mock del servicio y repositorio
const mockSearchVehicles = jest.fn();
const mockGetVehicleById = jest.fn();

jest.mock('@/domain/services/VehicleService', () => {
  const mockSearchVehicles = jest.fn();
  const mockGetVehicleById = jest.fn();
  return {
    VehicleService: jest.fn().mockImplementation(() => ({
      searchVehicles: mockSearchVehicles,
      getVehicleById: mockGetVehicleById,
    })),
    __mockSearchVehicles: mockSearchVehicles,
    __mockGetVehicleById: mockGetVehicleById,
  };
});

jest.mock('@/infrastructure/repositories/VehicleRepository', () => {
  return {
    VehicleRepository: jest.fn().mockImplementation(() => ({})),
  };
});

// Obtener referencias a los mocks
const { VehicleService } = require('@/domain/services/VehicleService');

describe('searchVehicles thunk', () => {
  let store: ReturnType<typeof configureStore>;
  let mockSearchVehiclesFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Obtener la instancia mock del servicio
    const serviceInstance = new VehicleService({});
    mockSearchVehiclesFn = serviceInstance.searchVehicles as jest.Mock;

    store = configureStore({
      reducer: {
        search: searchSlice,
        vehicles: vehicleSlice,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['search/setSearchParams'],
            ignoredPaths: ['search.params.pickupDate', 'search.params.returnDate'],
          },
        }),
    });
  });

  it('debe buscar vehículos y actualizar el estado correctamente', async () => {
    const params: SearchParams = {
      location: 'Madrid',
      pickupDate: new Date('2024-12-01'),
      returnDate: new Date('2024-12-05'),
    };

    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        name: 'Test Vehicle',
        type: 'economy',
        pricePerDay: 25,
        features: ['AC'],
        available: true,
      },
    ];

    mockSearchVehiclesFn.mockResolvedValue(mockVehicles);

    const result = await store.dispatch(searchVehicles(params));

    expect(searchVehicles.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(mockVehicles);

    const state = store.getState();
    expect(state.vehicles.items).toEqual(mockVehicles);
    expect(state.search.params?.location).toBe(params.location);
    expect(state.search.isLoading).toBe(false);
    expect(state.vehicles.isLoading).toBe(false);
  });

  it('debe establecer loading en true durante la búsqueda', async () => {
    const params: SearchParams = {
      location: 'Barcelona',
      pickupDate: new Date('2024-12-01'),
      returnDate: new Date('2024-12-05'),
    };

    // Simular un delay
    mockSearchVehiclesFn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const promise = store.dispatch(searchVehicles(params));

    // Verificar que loading está en true
    let state = store.getState();
    expect(state.search.isLoading).toBe(true);
    expect(state.vehicles.isLoading).toBe(true);

    await promise;

    // Verificar que loading volvió a false
    state = store.getState();
    expect(state.search.isLoading).toBe(false);
    expect(state.vehicles.isLoading).toBe(false);
  });

  it('debe manejar errores correctamente', async () => {
    const params: SearchParams = {
      location: 'Valencia',
      pickupDate: new Date('2024-12-01'),
      returnDate: new Date('2024-12-05'),
    };

    const errorMessage = 'Error al buscar vehículos';
    mockSearchVehiclesFn.mockRejectedValue(new Error(errorMessage));

    const result = await store.dispatch(searchVehicles(params));

    expect(searchVehicles.rejected.match(result)).toBe(true);
    expect(result.payload).toBe(errorMessage);

    const state = store.getState();
    expect(state.search.error).toBe(errorMessage);
    expect(state.vehicles.error).toBe(errorMessage);
    expect(state.search.isLoading).toBe(false);
    expect(state.vehicles.isLoading).toBe(false);
  });

  it('debe actualizar los parámetros de búsqueda en el estado', async () => {
    const params: SearchParams = {
      location: 'Sevilla',
      pickupDate: new Date('2024-12-01'),
      returnDate: new Date('2024-12-05'),
    };

    mockSearchVehiclesFn.mockResolvedValue([]);

    await store.dispatch(searchVehicles(params));

    const state = store.getState();
    expect(state.search.params).toBeDefined();
    expect(state.search.params?.location).toBe(params.location);
  });
});

