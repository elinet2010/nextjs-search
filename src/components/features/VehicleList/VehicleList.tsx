'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setVehicles } from '@/store/slices/vehicleSlice';
import { setSearchParams } from '@/store/slices/searchSlice';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';
import { VehicleCard } from '../VehicleCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import styles from './VehicleList.module.css';

interface VehicleListProps {
  initialVehicles: Vehicle[];
  searchParams: SearchParams;
}

export function VehicleList({ initialVehicles, searchParams }: VehicleListProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector((state) => state.vehicles.items);
  const isLoading = useAppSelector((state) => state.vehicles.isLoading);
  const error = useAppSelector((state) => state.vehicles.error);

  // Inicializar el store con los datos del servidor (SSR hydration)
  useEffect(() => {
    // Solo inicializar vehículos si el store está vacío (sin datos del servidor)
    // Esto preserva los estados de error/loading que puedan estar configurados
    // (por ejemplo, en tests o cuando hay una búsqueda en progreso)
    if (vehicles.length === 0 && initialVehicles.length > 0) {
      dispatch(setVehicles(initialVehicles));
    }
    // Siempre inicializar searchParams para SSR
    dispatch(setSearchParams(searchParams));
  }, [initialVehicles, searchParams, dispatch, vehicles.length]);

  // Usar vehículos del store (que se inicializan con los del servidor)
  // Si el store está vacío pero tenemos initialVehicles, usar esos (fallback)
  const displayVehicles = vehicles.length > 0 ? vehicles : initialVehicles;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage
          message={error}
          title="Error al cargar vehículos"
          variant="error"
        />
      </div>
    );
  }

  if (isLoading && displayVehicles.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" message="Cargando vehículos..." />
      </div>
    );
  }

  if (displayVehicles.length === 0) {
    return (
      <EmptyState
        icon="🚗"
        title="No se encontraron vehículos"
        message="No hay vehículos disponibles para los criterios de búsqueda seleccionados. Intenta modificar tus fechas o ubicación."
        action={
          <Button variant="primary" onClick={() => router.push('/')}>
            Nueva Búsqueda
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.list}>
      {displayVehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

