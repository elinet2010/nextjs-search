import type { Vehicle } from '../entities/Vehicle';
import type { SearchParams } from '../entities/SearchParams';

export interface IVehicleRepository {
  searchVehicles(params: SearchParams): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
}

