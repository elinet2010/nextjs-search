export type VehicleType = 'economy' | 'standard' | 'luxury' | 'suv';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  pricePerDay: number;
  imageUrl?: string;
  features: string[];
  available: boolean;
}


