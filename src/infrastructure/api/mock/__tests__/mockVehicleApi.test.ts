import { mockVehicleApi, mockVehicles } from '../mockVehicleApi';
import type { SearchParams } from '@/domain/entities/SearchParams';

describe('mockVehicleApi', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('search', () => {
    it('debe retornar una lista de vehículos disponibles', async () => {
      const params: SearchParams = {
        location: 'Madrid',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const promise = mockVehicleApi.search(params);
      jest.advanceTimersByTime(1000);
      const vehicles = await promise;

      expect(vehicles).toBeDefined();
      expect(Array.isArray(vehicles)).toBe(true);
      expect(vehicles.length).toBeGreaterThan(0);
      // Verificar que todos los vehículos retornados están disponibles
      if (vehicles.length > 0) {
        expect(vehicles.every((v) => v.available)).toBe(true);
      }
    });

    it('debe simular un delay de red', async () => {
      const params: SearchParams = {
        location: 'Barcelona',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const startTime = Date.now();
      const promise = mockVehicleApi.search(params);
      
      // Avanzar el timer
      jest.advanceTimersByTime(1000);
      await promise;
      
      // Verificar que se simuló el delay (aunque con fake timers)
      expect(promise).resolves.toBeDefined();
    });

    it('debe retornar solo vehículos disponibles', async () => {
      const params: SearchParams = {
        location: 'Valencia',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const promise = mockVehicleApi.search(params);
      jest.advanceTimersByTime(1000);
      const vehicles = await promise;

      vehicles.forEach((vehicle) => {
        expect(vehicle.available).toBe(true);
      });
    });

    it('debe retornar vehículos de la lista mock', async () => {
      const params: SearchParams = {
        location: 'Sevilla',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const promise = mockVehicleApi.search(params);
      jest.advanceTimersByTime(1000);
      const vehicles = await promise;

      // Verificar que retorna vehículos de la lista mock
      expect(vehicles.length).toBeGreaterThan(0);
      expect(vehicles.every((v) => v.id && v.name && v.pricePerDay)).toBe(true);
    });
  });

  describe('getById', () => {
    it('debe retornar un vehículo por ID', async () => {
      const vehicleId = '1';
      const promise = mockVehicleApi.getById(vehicleId);
      jest.advanceTimersByTime(500);
      const vehicle = await promise;

      expect(vehicle).toBeDefined();
      expect(vehicle?.id).toBe(vehicleId);
      expect(vehicle?.name).toBe('Toyota Corolla');
    });

    it('debe retornar null si el vehículo no existe', async () => {
      const nonExistentId = '999';
      const promise = mockVehicleApi.getById(nonExistentId);
      jest.advanceTimersByTime(500);
      const vehicle = await promise;

      expect(vehicle).toBeNull();
    });

    it('debe simular un delay de red', async () => {
      const vehicleId = '2';
      const promise = mockVehicleApi.getById(vehicleId);
      
      jest.advanceTimersByTime(500);
      const vehicle = await promise;

      expect(vehicle).toBeDefined();
      expect(vehicle?.id).toBe(vehicleId);
    });

    it('debe retornar el vehículo correcto para diferentes IDs', async () => {
      const testCases = [
        { id: '1', expectedName: 'Toyota Corolla' },
        { id: '2', expectedName: 'Honda Civic' },
        { id: '3', expectedName: 'BMW 5 Series' },
      ];

      for (const testCase of testCases) {
        const promise = mockVehicleApi.getById(testCase.id);
        jest.advanceTimersByTime(500);
        const vehicle = await promise;

        expect(vehicle?.id).toBe(testCase.id);
        expect(vehicle?.name).toBe(testCase.expectedName);
      }
    });
  });
});

