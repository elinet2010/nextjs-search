import { VehicleService } from '../VehicleService';
import type { IVehicleRepository } from '../../repositories/IVehicleRepository';
import type { Vehicle } from '../../entities/Vehicle';
import type { SearchParams } from '../../entities/SearchParams';

// Mock del repositorio
const createMockRepository = (): IVehicleRepository => {
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Test Vehicle',
      type: 'economy',
      pricePerDay: 25,
      features: ['AC'],
      available: true,
    },
    {
      id: '2',
      name: 'Unavailable Vehicle',
      type: 'standard',
      pricePerDay: 35,
      features: ['AC', 'GPS'],
      available: false,
    },
  ];

  return {
    searchVehicles: jest.fn().mockResolvedValue(mockVehicles),
    getVehicleById: jest.fn().mockResolvedValue(mockVehicles[0]),
  };
};

describe('VehicleService', () => {
  let service: VehicleService;
  let mockRepository: IVehicleRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new VehicleService(mockRepository);
  });

  describe('searchVehicles', () => {
    it('debe buscar vehículos correctamente', async () => {
      const params: SearchParams = {
        location: 'Madrid',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const result = await service.searchVehicles(params);

      expect(mockRepository.searchVehicles).toHaveBeenCalledWith(params);
      expect(result).toHaveLength(1); // Solo vehículos disponibles
      expect(result[0].available).toBe(true);
    });

    it('debe filtrar vehículos no disponibles', async () => {
      const params: SearchParams = {
        location: 'Madrid',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const result = await service.searchVehicles(params);

      expect(result.every((v) => v.available)).toBe(true);
    });

    it('debe lanzar error si los parámetros son inválidos', async () => {
      const invalidParams = {
        location: '',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      } as SearchParams;

      await expect(service.searchVehicles(invalidParams)).rejects.toThrow();
    });
  });

  describe('getVehicleById', () => {
    it('debe obtener un vehículo por ID', async () => {
      const result = await service.getVehicleById('1');

      expect(mockRepository.getVehicleById).toHaveBeenCalledWith('1');
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
    });

    it('debe lanzar error si el ID está vacío', async () => {
      await expect(service.getVehicleById('')).rejects.toThrow();
    });
  });

  describe('calculateTotalPrice', () => {
    it('debe calcular el precio total correctamente', () => {
      const vehicle: Vehicle = {
        id: '1',
        name: 'Test',
        type: 'economy',
        pricePerDay: 25,
        features: [],
        available: true,
      };

      const total = service.calculateTotalPrice(vehicle, 5);

      expect(total).toBe(125); // 25 * 5
    });
  });
});





