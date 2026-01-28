'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectVehicle } from '@/store/slices/vehicleSlice';
import { setBooking } from '@/store/slices/bookingSlice';
import { VehicleService } from '@/domain/services/VehicleService';
import { VehicleRepository } from '@/infrastructure/repositories/VehicleRepository';
import { calculateDays } from '@/domain/entities/Booking';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './VehicleCard.module.css';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParamsFromStore = useAppSelector((state) => state.search.params);

  const handleSelect = () => {
    // Obtener parámetros de búsqueda del store o URL
    let searchParams: SearchParams | null = searchParamsFromStore;

    // Fallback: obtener de la URL si no está en el store
    if (!searchParams && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const location = params.get('location');
      const pickupDate = params.get('pickupDate');
      const returnDate = params.get('returnDate');

      if (location && pickupDate && returnDate) {
        searchParams = {
          location,
          pickupDate: new Date(pickupDate),
          returnDate: new Date(returnDate),
        };
      }
    }

    if (!searchParams) {
      console.error('No hay parámetros de búsqueda disponibles');
      return;
    }

    // Calcular precio total
    const days = calculateDays(
      searchParams.pickupDate,
      searchParams.returnDate
    );
    const vehicleService = new VehicleService(new VehicleRepository());
    const totalPrice = vehicleService.calculateTotalPrice(vehicle, days);

    // Seleccionar vehículo
    dispatch(selectVehicle(vehicle.id));

    // Crear booking
    dispatch(
      setBooking({
        vehicle,
        searchParams,
        totalPrice,
      })
    );

    // Navegar a resumen
    router.push('/summary');
  };

  // Usar formatter de utils
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getTypeLabel = (type: Vehicle['type']): string => {
    const labels: Record<Vehicle['type'], string> = {
      economy: 'Económico',
      standard: 'Estándar',
      luxury: 'Lujo',
      suv: 'SUV',
    };
    return labels[type] || type;
  };

  return (
    <Card variant="elevated" padding="lg" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{vehicle.name}</h3>
        <span className={styles.type}>{getTypeLabel(vehicle.type)}</span>
      </div>

      <div className={styles.price}>
        <span className={styles.priceLabel}>Precio por día</span>
        <span className={styles.priceValue}>{formatPrice(vehicle.pricePerDay)}</span>
      </div>

      {vehicle.features.length > 0 && (
        <div className={styles.features}>
          <h4 className={styles.featuresTitle}>Características:</h4>
          <ul className={styles.featuresList}>
            {vehicle.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.availability}>
        {vehicle.available ? (
          <span className={styles.available}>✓ Disponible</span>
        ) : (
          <span className={styles.unavailable}>✗ No disponible</span>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSelect}
        disabled={!vehicle.available}
      >
        Seleccionar
      </Button>
    </Card>
  );
}

