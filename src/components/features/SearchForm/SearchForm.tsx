'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchVehicles } from '@/store/thunks';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { validateSearchForm } from '@/utils/validators';
import type { SearchParams } from '@/domain/entities/SearchParams';
import styles from './SearchForm.module.css';

export function SearchForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.search.isLoading);
  const error = useAppSelector((state) => state.search.error);

  const [formData, setFormData] = useState<Partial<SearchParams>>({
    location: '',
    pickupDate: undefined,
    returnDate: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setFormData((prev) => ({ ...prev, location: newLocation }));
    
    // Validación en tiempo real (solo si ya hay un error o el campo tiene contenido)
    if (errors.location || newLocation.length > 0) {
      const validation = validateSearchForm(
        { ...formData, location: newLocation },
        false
      );
      setErrors((prev) => ({
        ...prev,
        location: validation.errors.location || '',
      }));
    }
  };

  const handlePickupDateChange = (date: Date | null) => {
    const dateValue = date || undefined;
    const newFormData = { ...formData, pickupDate: dateValue };
    setFormData(newFormData);
    
    // Validación en tiempo real
    if (errors.pickupDate || dateValue) {
      const validation = validateSearchForm(newFormData, false);
      setErrors((prev) => ({
        ...prev,
        pickupDate: validation.errors.pickupDate || '',
        returnDate: validation.errors.returnDate || prev.returnDate || '',
      }));
    }
    
    // Si la fecha de devolución es anterior a la nueva fecha de recogida, limpiar
    if (date && formData.returnDate && formData.returnDate <= date) {
      setFormData((prev) => ({ ...prev, returnDate: undefined }));
      setErrors((prev) => ({ ...prev, returnDate: '' }));
    }
  };

  const handleReturnDateChange = (date: Date | null) => {
    const dateValue = date || undefined;
    const newFormData = { ...formData, returnDate: dateValue };
    setFormData(newFormData);
    
    // Validación en tiempo real
    if (errors.returnDate || dateValue) {
      const validation = validateSearchForm(newFormData, false);
      setErrors((prev) => ({
        ...prev,
        returnDate: validation.errors.returnDate || '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar formulario completo
    const validation = validateSearchForm(formData, true);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll al primer error
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement)?.focus();
      }
      return;
    }

    // Limpiar errores previos
    setErrors({});

    // Crear objeto SearchParams completo
    const searchParams: SearchParams = {
      location: formData.location!,
      pickupDate: formData.pickupDate!,
      returnDate: formData.returnDate!,
    };

    try {
      // Dispatch de la acción de búsqueda
      const result = await dispatch(searchVehicles(searchParams));

      // Si la búsqueda fue exitosa, navegar a resultados
      if (searchVehicles.fulfilled.match(result)) {
        // Construir URL con parámetros de búsqueda
        const params = new URLSearchParams({
          location: searchParams.location,
          pickupDate: searchParams.pickupDate.toISOString().split('T')[0],
          returnDate: searchParams.returnDate.toISOString().split('T')[0],
        });

        router.push(`/results?${params.toString()}`);
      }
    } catch (err) {
      // El error ya está manejado en el thunk
      console.error('Error en búsqueda:', err);
    }
  };

  // Calcular fecha mínima (hoy)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcular fecha mínima para devolución (día siguiente a recogida)
  const minReturnDate = formData.pickupDate
    ? new Date(formData.pickupDate.getTime() + 24 * 60 * 60 * 1000)
    : undefined;

  return (
    <Card variant="elevated" padding="lg" className={styles.formCard}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        {error && (
          <ErrorMessage
            message={error}
            title="Error en la búsqueda"
            onDismiss={() => {
              // El error se limpia automáticamente cuando se hace una nueva búsqueda
            }}
            variant="error"
          />
        )}

        <div className={styles.fields}>
          <Input
            label="Ciudad o Aeropuerto"
            name="location"
            value={formData.location || ''}
            onChange={handleLocationChange}
            placeholder="Ej: Madrid, MAD"
            error={errors.location}
            required
            fullWidth
            autoComplete="off"
          />

          <DatePicker
            label="Fecha de Recogida"
            value={formData.pickupDate || null}
            onChange={handlePickupDateChange}
            minDate={today}
            error={errors.pickupDate}
            required
            fullWidth
          />

          <DatePicker
            label="Fecha de Devolución"
            value={formData.returnDate || null}
            onChange={handleReturnDateChange}
            minDate={minReturnDate || today}
            error={errors.returnDate}
            required
            fullWidth
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar Vehículos'}
        </Button>
      </form>
    </Card>
  );
}

