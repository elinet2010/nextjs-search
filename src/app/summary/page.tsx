'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearBooking } from '@/store/slices/bookingSlice';
import { clearSearch } from '@/store/slices/searchSlice';
import { clearVehicles } from '@/store/slices/vehicleSlice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/utils/formatters';
import styles from './page.module.css';

export default function SummaryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking.booking);

  // Redirigir a home si no hay booking
  useEffect(() => {
    if (!booking) {
      router.push('/');
    }
  }, [booking, router]);

  const handleNewSearch = () => {
    // Limpiar el estado
    dispatch(clearBooking());
    dispatch(clearSearch());
    dispatch(clearVehicles());
    // Navegar a home
    router.push('/');
  };

  if (!booking) {
    return null; // Se redirigirá en el useEffect
  }

  const { vehicle, searchParams, totalPrice, days } = booking;

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      economy: 'Económico',
      standard: 'Estándar',
      luxury: 'Lujo',
      suv: 'SUV',
    };
    return labels[type] || type;
  };

  return (
    <>
      <Header logo={<h1>OutletRentalCars</h1>} />
      <main id="main-content" className={styles.main}>
        <Container size="lg">
          <div className={styles.header}>
            <h2 className={styles.title}>Resumen de tu Reserva</h2>
            <p className={styles.subtitle}>
              Revisa los detalles de tu selección antes de continuar
            </p>
          </div>

          <div className={styles.content}>
            {/* Información del Vehículo */}
            <Card variant="elevated" padding="lg" className={styles.vehicleCard}>
              <h3 className={styles.sectionTitle}>Vehículo Seleccionado</h3>
              <div className={styles.vehicleInfo}>
                <div className={styles.vehicleHeader}>
                  <h4 className={styles.vehicleName}>{vehicle.name}</h4>
                  <span className={styles.vehicleType}>
                    {getTypeLabel(vehicle.type)}
                  </span>
                </div>

                {vehicle.features.length > 0 && (
                  <div className={styles.features}>
                    <h5 className={styles.featuresTitle}>Características:</h5>
                    <ul className={styles.featuresList}>
                      {vehicle.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Información de la Reserva */}
            <Card variant="elevated" padding="lg" className={styles.bookingCard}>
              <h3 className={styles.sectionTitle}>Detalles de la Reserva</h3>
              <div className={styles.bookingInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ubicación:</span>
                  <span className={styles.infoValue}>{searchParams.location}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Fecha de Recogida:</span>
                  <span className={styles.infoValue}>
                    {formatDate(searchParams.pickupDate)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Fecha de Devolución:</span>
                  <span className={styles.infoValue}>
                    {formatDate(searchParams.returnDate)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Duración:</span>
                  <span className={styles.infoValue}>
                    {days} día{days !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Card>

            {/* Resumen de Precios */}
            <Card variant="elevated" padding="lg" className={styles.priceCard}>
              <h3 className={styles.sectionTitle}>Resumen de Precios</h3>
              <div className={styles.priceDetails}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    Precio por día ({days} día{days !== 1 ? 's' : ''})
                  </span>
                  <span className={styles.priceValue}>
                    {formatPrice(vehicle.pricePerDay)}
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Subtotal:</span>
                  <span className={styles.priceValue}>
                    {formatPrice(vehicle.pricePerDay * days)}
                  </span>
                </div>
                <div className={styles.priceTotal}>
                  <span className={styles.totalLabel}>Precio Total:</span>
                  <span className={styles.totalValue}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Acciones */}
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="lg"
                onClick={handleNewSearch}
                className={styles.backButton}
              >
                Volver a Buscar
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  // Aquí se integraría con la pasarela de pago
                  alert('Integración con pasarela de pago (conceptual)');
                }}
                className={styles.payButton}
              >
                Proceder al Pago
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

