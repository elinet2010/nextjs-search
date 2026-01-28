import { formatPrice, formatDate, formatDateShort } from '../formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('debe formatear un precio correctamente', () => {
      const result = formatPrice(25.5);

      expect(result).toContain('25,50');
      expect(result).toContain('€');
    });

    it('debe formatear precios grandes correctamente', () => {
      const result = formatPrice(1000);

      // El formato puede variar según la configuración regional
      expect(result).toContain('1000');
      expect(result).toContain('€');
    });

    it('debe aceptar una moneda personalizada', () => {
      const result = formatPrice(25.5, 'USD');

      expect(result).toContain('$');
    });
  });

  describe('formatDate', () => {
    it('debe formatear una fecha en español', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date);

      expect(result).toContain('2024');
      expect(result).toContain('diciembre');
    });

    it('debe aceptar opciones personalizadas', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('formatDateShort', () => {
    it('debe formatear una fecha en formato corto', () => {
      const date = new Date('2024-12-25');
      const result = formatDateShort(date);

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });
});

