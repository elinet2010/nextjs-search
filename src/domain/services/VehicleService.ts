import type { IVehicleRepository } from '../repositories/IVehicleRepository';
import type { Vehicle } from '../entities/Vehicle';
import type { SearchParams } from '../entities/SearchParams';

export class VehicleService {
  constructor(private repository: IVehicleRepository) {}

  async searchVehicles(params: SearchParams): Promise<Vehicle[]> {
    // Validaciones de negocio
    if (!this.isValidSearchParams(params)) {
      throw new Error('Invalid search parameters');
    }

    // Llamada al repositorio
    const vehicles = await this.repository.searchVehicles(params);

    // Filtrar solo vehículos disponibles
    return this.filterAvailableVehicles(vehicles);
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('Vehicle ID is required');
    }

    return await this.repository.getVehicleById(id);
  }

  calculateTotalPrice(vehicle: Vehicle, days: number): number {
    return vehicle.pricePerDay * days;
  }

  private isValidSearchParams(params: SearchParams): boolean {
    if (!params.location || params.location.trim().length === 0) {
      return false;
    }

    if (!params.pickupDate || !params.returnDate) {
      return false;
    }

    if (params.returnDate <= params.pickupDate) {
      return false;
    }

    return true;
  }

  private filterAvailableVehicles(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.filter((v) => v.available);
  }
}


