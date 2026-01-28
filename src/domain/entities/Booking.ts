import type { Vehicle } from './Vehicle';
import type { SearchParams } from './SearchParams';

export interface Booking {
  id: string;
  vehicle: Vehicle;
  searchParams: SearchParams;
  totalPrice: number;
  days: number;
  createdAt: Date;
}

export function calculateDays(pickupDate: Date, returnDate: Date): number {
  const diffTime = returnDate.getTime() - pickupDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

