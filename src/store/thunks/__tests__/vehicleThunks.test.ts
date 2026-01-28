import { configureStore } from '@reduxjs/toolkit';
import { fetchVehicleById } from '../vehicleThunks';
import type { Vehicle } from '@/domain/entities/Vehicle';
import vehicleSlice from '@/store/slices/vehicleSlice';

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

describe('fetchVehicleById thunk', () => {
  let store: ReturnType<typeof configureStore>;
  let mockGetVehicleByIdFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Obtener la instancia mock del servicio
    const serviceInstance = new VehicleService({});
    mockGetVehicleByIdFn = serviceInstance.getVehicleById as jest.Mock;

    store = configureStore({
      reducer: {
        vehicles: vehicleSlice,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  });

  it('debe obtener un vehículo por ID y actualizar el estado', async () => {
    const vehicleId = '1';
    const mockVehicle: Vehicle = {
      id: vehicleId,
      name: 'Test Vehicle',
      type: 'economy',
      pricePerDay: 25,
      features: ['AC'],
      available: true,
    };

    mockGetVehicleByIdFn.mockResolvedValue(mockVehicle);

    const result = await store.dispatch(fetchVehicleById(vehicleId));

    expect(fetchVehicleById.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(mockVehicle);

    const state = store.getState();
    expect(state.vehicles.selectedVehicleId).toBe(vehicleId);
    expect(state.vehicles.error).toBeNull();
  });

  it('debe manejar el caso cuando el vehículo no existe', async () => {
    const vehicleId = '999';
    mockGetVehicleByIdFn.mockResolvedValue(null);

    const result = await store.dispatch(fetchVehicleById(vehicleId));

    expect(fetchVehicleById.rejected.match(result)).toBe(true);
    expect(result.payload).toBe('Vehículo no encontrado');

    const state = store.getState();
    expect(state.vehicles.error).toBe('Vehículo no encontrado');
  });

  it('debe manejar errores del servicio', async () => {
    const vehicleId = '1';
    const errorMessage = 'Error de red';
    mockGetVehicleByIdFn.mockRejectedValue(new Error(errorMessage));

    const result = await store.dispatch(fetchVehicleById(vehicleId));

    expect(fetchVehicleById.rejected.match(result)).toBe(true);
    expect(result.payload).toBe(errorMessage);

    const state = store.getState();
    expect(state.vehicles.error).toBe(errorMessage);
  });

  it('debe establecer el vehículo seleccionado correctamente', async () => {
    const vehicleId = '2';
    const mockVehicle: Vehicle = {
      id: vehicleId,
      name: 'Another Vehicle',
      type: 'standard',
      pricePerDay: 35,
      features: ['AC', 'GPS'],
      available: true,
    };

    mockGetVehicleByIdFn.mockResolvedValue(mockVehicle);

    await store.dispatch(fetchVehicleById(vehicleId));

    const state = store.getState();
    expect(state.vehicles.selectedVehicleId).toBe(vehicleId);
  });
});

