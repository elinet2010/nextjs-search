import type { IVehicleRepository } from '@/domain/repositories/IVehicleRepository';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';
import { mockVehicleApi } from '../api/mock/mockVehicleApi';

export class VehicleRepository implements IVehicleRepository {
  async searchVehicles(params: SearchParams): Promise<Vehicle[]> {
    // Por ahora usamos el mock, pero aquí se puede cambiar a una API real
    return await mockVehicleApi.search();
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return await mockVehicleApi.getById(id);
  }
}





