import { validateSearchForm, validateField } from '../validators';
import type { SearchParams } from '@/domain/entities/SearchParams';

describe('validators', () => {
  describe('validateSearchForm', () => {
    it('debe validar correctamente un formulario válido', () => {
      // Usar fechas futuras para que pasen la validación
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const params: SearchParams = {
        location: 'Madrid',
        pickupDate: tomorrow,
        returnDate: nextWeek,
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('debe retornar error si la ubicación está vacía', () => {
      const params: Partial<SearchParams> = {
        location: '',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(false);
      expect(result.errors.location).toBeDefined();
    });

    it('debe retornar error si la ubicación tiene menos de 2 caracteres', () => {
      const params: Partial<SearchParams> = {
        location: 'M',
        pickupDate: new Date('2024-12-01'),
        returnDate: new Date('2024-12-05'),
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(false);
      expect(result.errors.location).toContain('al menos 2 caracteres');
    });

    it('debe retornar error si la fecha de recogida es en el pasado', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const params: Partial<SearchParams> = {
        location: 'Madrid',
        pickupDate: yesterday,
        returnDate: nextWeek,
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(false);
      expect(result.errors.pickupDate).toContain('pasado');
    });

    it('debe retornar error si la fecha de devolución es anterior a la de recogida', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const params: Partial<SearchParams> = {
        location: 'Madrid',
        pickupDate: tomorrow,
        returnDate: yesterday,
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(false);
      expect(result.errors.returnDate).toBeDefined();
    });

    it('debe retornar error si la reserva excede 90 días', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const returnDate = new Date(tomorrow);
      returnDate.setDate(returnDate.getDate() + 91);

      const params: Partial<SearchParams> = {
        location: 'Madrid',
        pickupDate: tomorrow,
        returnDate,
      };

      const result = validateSearchForm(params, true);

      expect(result.isValid).toBe(false);
      expect(result.errors.returnDate).toContain('90 días');
    });

    it('debe permitir validación parcial cuando validateAll es false', () => {
      const params: Partial<SearchParams> = {
        location: 'Madrid',
        // pickupDate y returnDate no están definidos
      };

      const result = validateSearchForm(params, false);

      // No debe fallar por campos faltantes
      expect(result.errors.pickupDate).toBeUndefined();
      expect(result.errors.returnDate).toBeUndefined();
    });
  });

  describe('validateField', () => {
    it('debe validar un campo individual correctamente', () => {
      const error = validateField('location', 'Madrid', {});

      expect(error).toBeUndefined();
    });

    it('debe retornar error para un campo inválido', () => {
      const error = validateField('location', 'M', {});

      expect(error).toBeDefined();
      expect(error).toContain('al menos 2 caracteres');
    });
  });
});

