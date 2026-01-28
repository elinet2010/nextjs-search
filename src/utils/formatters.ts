/**
 * Formatea un precio como moneda
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Formatea una fecha en formato español
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('es-ES', options || defaultOptions);
}

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

