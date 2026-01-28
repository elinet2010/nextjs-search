import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VehicleList } from '@/components/features/VehicleList';
import { VehicleService } from '@/domain/services/VehicleService';
import { VehicleRepository } from '@/infrastructure/repositories/VehicleRepository';
import type { SearchParams } from '@/domain/entities/SearchParams';
import styles from './page.module.css';

interface ResultsPageProps {
  searchParams: {
    location?: string;
    pickupDate?: string;
    returnDate?: string;
  };
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  // Validar que los parámetros estén presentes
  if (!searchParams.location || !searchParams.pickupDate || !searchParams.returnDate) {
    redirect('/');
  }

  // Crear objeto SearchParams
  const params: SearchParams = {
    location: searchParams.location,
    pickupDate: new Date(searchParams.pickupDate),
    returnDate: new Date(searchParams.returnDate),
  };

  // Validar fechas
  if (isNaN(params.pickupDate.getTime()) || isNaN(params.returnDate.getTime())) {
    redirect('/');
  }

  // Fetch de vehículos en el servidor (SSR)
  const vehicleService = new VehicleService(new VehicleRepository());
  let vehicles = [];

  try {
    vehicles = await vehicleService.searchVehicles(params);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    // En caso de error, redirigir a home con mensaje de error
    redirect('/?error=search_failed');
  }

  // Si no hay vehículos, mostrar página vacía (no redirigir)
  // El componente VehicleList manejará el estado vacío

  return (
    <>
      <Header logo={<h1>OutletRentalCars</h1>} />
      <main id="main-content" className={styles.main}>
        <Container size="xl">
          <div className={styles.header}>
            <h2 className={styles.title}>Vehículos Disponibles</h2>
            {vehicles.length > 0 && (
              <p className={styles.count}>
                {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''}{' '}
                disponible{vehicles.length !== 1 ? 's' : ''}
              </p>
            )}
            <div className={styles.searchInfo}>
              <p>
                <strong>Ubicación:</strong> {params.location}
              </p>
              <p>
                <strong>Recogida:</strong>{' '}
                {params.pickupDate.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>
                <strong>Devolución:</strong>{' '}
                {params.returnDate.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <VehicleList initialVehicles={vehicles} searchParams={params} />
        </Container>
      </main>
      <Footer />
    </>
  );
}

