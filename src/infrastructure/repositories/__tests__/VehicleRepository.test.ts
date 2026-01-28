import { VehicleRepository } from '../VehicleRepository';
import { mockVehicleApi } from '../../api/mock/mockVehicleApi';
import type { SearchParams } from '@/domain/entities/SearchParams';
import type { Vehicle } from '@/domain/entities/Vehicle';

// Mock del API
jest.mock('../../api/mock/mockVehicleApi', () => ({
  mockVehicleApi: {
    search: jest.fn(),
    getById: jest.fn(),
  },
}));

describe('VehicleRepository', () => {
  let repository: VehicleRepository;
  const mockSearch = mockVehicleApi.search as jest.MockedFunction<typeof mockVehicleApi.search>;
  const mockGetById = mockVehicleApi.getById as jest.MockedFunction<typeof mockVehicleApi.getById>;

  beforeEach(() => {
    repository = new VehicleRepository();
    jest.clearAllMocks();
  });

  describe('searchVehicles', () => {
    it('debe llamar al API mock', async () => {
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

      mockSearch.mockResolvedValue(mockVehicles);

      const result = await repository.searchVehicles(params);

      expect(mockSearch).toHaveBeenCalled();
      expect(result).toEqual(mockVehicles);
    });

    it('debe manejar errores del API', async () => {
      const params: SearchParams = {
        location: 'Barcelona',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const errorMessage = 'Error de red';
      mockSearch.mockRejectedValue(new Error(errorMessage));

      await expect(repository.searchVehicles(params)).rejects.toThrow();
    });

    it('debe retornar una lista vacía si el API retorna una lista vacía', async () => {
      const params: SearchParams = {
        location: 'Valencia',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      mockSearch.mockResolvedValue([]);

      const result = await repository.searchVehicles(params);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('debe propagar errores del API', async () => {
      const params: SearchParams = {
        location: 'Sevilla',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      mockSearch.mockRejectedValue(new Error('Network error'));

      await expect(repository.searchVehicles(params)).rejects.toThrow();
    });
  });

  describe('getVehicleById', () => {
    it('debe llamar al API mock con el ID correcto', async () => {
      const vehicleId = '1';
      const mockVehicle: Vehicle = {
        id: vehicleId,
        name: 'Test Vehicle',
        type: 'economy',
        pricePerDay: 25,
        features: ['AC'],
        available: true,
      };

      mockGetById.mockResolvedValue(mockVehicle);

      const result = await repository.getVehicleById(vehicleId);

      expect(mockGetById).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(mockVehicle);
    });

    it('debe retornar null si el vehículo no existe', async () => {
      const vehicleId = '999';
      mockGetById.mockResolvedValue(null);

      const result = await repository.getVehicleById(vehicleId);

      expect(mockGetById).toHaveBeenCalledWith(vehicleId);
      expect(result).toBeNull();
    });

    it('debe manejar errores del API', async () => {
      const vehicleId = '1';
      const errorMessage = 'Error de red';
      mockGetById.mockRejectedValue(new Error(errorMessage));

      await expect(repository.getVehicleById(vehicleId)).rejects.toThrow();
    });

    it('debe propagar errores del API', async () => {
      const vehicleId = '1';
      mockGetById.mockRejectedValue(new Error('Network error'));

      await expect(repository.getVehicleById(vehicleId)).rejects.toThrow();
    });
  });
});

