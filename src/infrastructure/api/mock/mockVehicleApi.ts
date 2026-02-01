import type { Vehicle } from '@/domain/entities/Vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota Corolla',
    type: 'economy',
    pricePerDay: 25,
    features: ['AC', 'Bluetooth', 'GPS'],
    available: true,
  },
  {
    id: '2',
    name: 'Honda Civic',
    type: 'standard',
    pricePerDay: 35,
    features: ['AC', 'Bluetooth', 'GPS', 'Leather Seats'],
    available: true,
  },
  {
    id: '3',
    name: 'BMW 5 Series',
    type: 'luxury',
    pricePerDay: 80,
    features: [
      'AC',
      'Bluetooth',
      'GPS',
      'Leather Seats',
      'Sunroof',
      'Premium Sound',
    ],
    available: true,
  },
];

export const mockVehicleApi = {
  search: async (): Promise<Vehicle[]> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockVehicles;
  },

  getById: async (id: string): Promise<Vehicle | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockVehicles.find((v) => v.id === id) || null;
  },
};





