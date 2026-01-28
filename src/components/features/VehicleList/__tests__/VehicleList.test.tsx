import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';
import { VehicleList } from '../VehicleList';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';
import * as nextNavigation from 'next/navigation';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('VehicleList', () => {
  const mockPush = jest.fn();
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Toyota Corolla',
      type: 'economy',
      pricePerDay: 25,
      features: ['AC', 'Bluetooth'],
      available: true,
    },
    {
      id: '2',
      name: 'Honda Civic',
      type: 'standard',
      pricePerDay: 35,
      features: ['AC', 'GPS'],
      available: true,
    },
  ];

  const searchParams: SearchParams = {
    location: 'Madrid',
    pickupDate: new Date('2024-12-01'),
    returnDate: new Date('2024-12-05'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('debe renderizar la lista de vehículos', () => {
    renderWithProviders(
      <VehicleList initialVehicles={mockVehicles} searchParams={searchParams} />
    );

    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
  });

  it('debe inicializar el store con los vehículos del servidor', async () => {
    const { store } = renderWithProviders(
      <VehicleList initialVehicles={mockVehicles} searchParams={searchParams} />
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.vehicles.items).toEqual(mockVehicles);
      expect(state.search.params?.location).toBe(searchParams.location);
    });
  });

  it('debe mostrar loading cuando isLoading es true y no hay vehículos', async () => {
    // El componente muestra loading solo si isLoading=true Y displayVehicles.length === 0
    // Pero el useEffect siempre inicializa con initialVehicles, así que necesitamos
    // que initialVehicles esté vacío y el store tenga isLoading=true
    const preloadedState = {
      search: {
        params: searchParams,
        isLoading: false,
        error: null,
      },
      vehicles: {
        items: [], // Vacío para que displayVehicles.length === 0
        selectedVehicleId: null,
        isLoading: true, // Loading activo
        error: null,
      },
      booking: {
        currentBooking: null,
        isConfirmed: false,
        error: null,
      },
    };

    renderWithProviders(
      <VehicleList initialVehicles={[]} searchParams={searchParams} />,
      { preloadedState }
    );

    // Esperar a que el useEffect termine de inicializar
    await waitFor(() => {
      // Después del useEffect, el store tendrá los initialVehicles (vacío)
      // pero isLoading sigue siendo true, así que debería mostrar loading
      // Usar getAllByText porque hay múltiples elementos (mensaje visible y srOnly)
      const loadingElements = screen.getAllByText(/cargando vehículos/i);
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar error cuando hay un error en el estado', async () => {
    const preloadedState = {
      search: {
        params: searchParams,
        isLoading: false,
        error: null,
      },
      vehicles: {
        items: [],
        selectedVehicleId: null,
        isLoading: false,
        error: 'Error al cargar vehículos', // Estado inicial con error
      },
      booking: {
        currentBooking: null,
        isConfirmed: false,
        error: null,
      },
    };

    renderWithProviders(
      <VehicleList initialVehicles={[]} searchParams={searchParams} />,
      { preloadedState }
    );

    await waitFor(() => {
      // Usar getAllByText porque hay título y mensaje con el mismo texto
      const errorElements = screen.getAllByText(/error al cargar vehículos/i);
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar estado vacío cuando no hay vehículos', () => {
    renderWithProviders(
      <VehicleList initialVehicles={[]} searchParams={searchParams} />
    );

    expect(screen.getByText(/no se encontraron vehículos/i)).toBeInTheDocument();
  });

  it('debe mostrar los vehículos del store después de la inicialización', async () => {
    // El componente inicializa el store con initialVehicles en useEffect
    // Este test verifica que después de la inicialización, se muestran los vehículos
    renderWithProviders(
      <VehicleList initialVehicles={mockVehicles} searchParams={searchParams} />
    );

    // Esperar a que el useEffect inicialice el store
    await waitFor(() => {
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });
  });

  it('debe usar vehículos del store después de la inicialización', async () => {
    // El componente siempre inicializa el store con initialVehicles en useEffect
    // Este test verifica que después de la inicialización, se muestran los vehículos del store
    const { store } = renderWithProviders(
      <VehicleList initialVehicles={mockVehicles} searchParams={searchParams} />
    );

    // Esperar a que el useEffect inicialice el store
    await waitFor(() => {
      const state = store.getState();
      expect(state.vehicles.items.length).toBeGreaterThan(0);
    });

    // Verificar que se muestran los vehículos iniciales
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
  });

  it('debe usar initialVehicles como fallback si el store está vacío', () => {
    renderWithProviders(
      <VehicleList initialVehicles={mockVehicles} searchParams={searchParams} />
    );

    // Debe mostrar los vehículos iniciales
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
  });
});

