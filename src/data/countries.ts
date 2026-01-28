// Lista de países y ciudades principales para autocompletado
export interface CountryOption {
  name: string;
  code: string;
  cities?: string[];
}

export const countries: CountryOption[] = [
  { name: 'España', code: 'ES', cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao'] },
  { name: 'México', code: 'MX', cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún', 'Playa del Carmen', 'Tulum'] },
  { name: 'Estados Unidos', code: 'US', cities: ['Nueva York', 'Los Ángeles', 'Miami', 'Orlando', 'San Diego', 'Las Vegas', 'Chicago'] },
  { name: 'Colombia', code: 'CO', cities: ['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla'] },
  { name: 'Argentina', code: 'AR', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Bariloche'] },
  { name: 'Chile', code: 'CL', cities: ['Santiago', 'Valparaíso', 'Viña del Mar', 'Puerto Varas'] },
  { name: 'Perú', code: 'PE', cities: ['Lima', 'Cusco', 'Arequipa', 'Trujillo'] },
  { name: 'Ecuador', code: 'EC', cities: ['Quito', 'Guayaquil', 'Cuenca'] },
  { name: 'Venezuela', code: 'VE', cities: ['Caracas', 'Maracaibo', 'Valencia'] },
  { name: 'Panamá', code: 'PA', cities: ['Ciudad de Panamá', 'Colón'] },
  { name: 'Costa Rica', code: 'CR', cities: ['San José', 'Liberia', 'Quepos'] },
  { name: 'República Dominicana', code: 'DO', cities: ['Santo Domingo', 'Punta Cana', 'Puerto Plata'] },
  { name: 'Puerto Rico', code: 'PR', cities: ['San Juan', 'Ponce', 'Mayagüez'] },
  { name: 'Brasil', code: 'BR', cities: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador', 'Florianópolis'] },
  { name: 'Francia', code: 'FR', cities: ['París', 'Lyon', 'Marsella', 'Niza', 'Burdeos'] },
  { name: 'Italia', code: 'IT', cities: ['Roma', 'Milán', 'Venecia', 'Florencia', 'Nápoles'] },
  { name: 'Reino Unido', code: 'GB', cities: ['Londres', 'Manchester', 'Edimburgo', 'Birmingham'] },
  { name: 'Alemania', code: 'DE', cities: ['Berlín', 'Múnich', 'Hamburgo', 'Frankfurt'] },
  { name: 'Portugal', code: 'PT', cities: ['Lisboa', 'Oporto', 'Faro'] },
  { name: 'Grecia', code: 'GR', cities: ['Atenas', 'Salónica', 'Heraclión'] },
  { name: 'Turquía', code: 'TR', cities: ['Estambul', 'Ankara', 'Antalya'] },
  { name: 'Emiratos Árabes Unidos', code: 'AE', cities: ['Dubái', 'Abu Dabi', 'Sharjah'] },
  { name: 'Japón', code: 'JP', cities: ['Tokio', 'Osaka', 'Kioto', 'Yokohama'] },
  { name: 'China', code: 'CN', cities: ['Pekín', 'Shanghái', 'Cantón', 'Shenzhen'] },
  { name: 'Tailandia', code: 'TH', cities: ['Bangkok', 'Phuket', 'Chiang Mai'] },
  { name: 'Singapur', code: 'SG', cities: ['Singapur'] },
  { name: 'Australia', code: 'AU', cities: ['Sídney', 'Melbourne', 'Brisbane', 'Perth'] },
  { name: 'Nueva Zelanda', code: 'NZ', cities: ['Auckland', 'Wellington', 'Christchurch'] },
  { name: 'Canadá', code: 'CA', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
];

/**
 * Busca países y ciudades que coincidan con el término de búsqueda
 * @param searchTerm - Término de búsqueda
 * @param maxResults - Número máximo de resultados (default: 3)
 * @returns Array de opciones que coinciden con la búsqueda
 */
export function searchCountries(searchTerm: string, maxResults: number = 3): string[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const results: string[] = [];
  const added = new Set<string>();

  // Primero buscar coincidencias exactas o que empiecen con el término
  for (const country of countries) {
    // Buscar en nombre del país
    if (country.name.toLowerCase().includes(term) && !added.has(country.name)) {
      results.push(country.name);
      added.add(country.name);
      if (results.length >= maxResults) break;
    }

    // Buscar en ciudades
    if (country.cities) {
      for (const city of country.cities) {
        const fullLocation = `${city}, ${country.name}`;
        if (
          (city.toLowerCase().includes(term) || city.toLowerCase().startsWith(term)) &&
          !added.has(fullLocation)
        ) {
          results.push(fullLocation);
          added.add(fullLocation);
          if (results.length >= maxResults) break;
        }
      }
    }

    if (results.length >= maxResults) break;
  }

  // Si no hay suficientes resultados, buscar coincidencias parciales
  if (results.length < maxResults) {
    for (const country of countries) {
      if (results.length >= maxResults) break;

      // Buscar en nombre del país (coincidencias parciales)
      if (
        country.name.toLowerCase().includes(term) &&
        !added.has(country.name) &&
        !results.includes(country.name)
      ) {
        results.push(country.name);
        added.add(country.name);
        if (results.length >= maxResults) break;
      }

      // Buscar en ciudades (coincidencias parciales)
      if (country.cities) {
        for (const city of country.cities) {
          const fullLocation = `${city}, ${country.name}`;
          if (
            city.toLowerCase().includes(term) &&
            !added.has(fullLocation) &&
            !results.includes(fullLocation)
          ) {
            results.push(fullLocation);
            added.add(fullLocation);
            if (results.length >= maxResults) break;
          }
        }
      }
    }
  }

  return results.slice(0, maxResults);
}

