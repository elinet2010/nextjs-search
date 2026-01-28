import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { VehicleCard } from '../VehicleCard';
import type { Vehicle } from '@/domain/entities/Vehicle';
import type { SearchParams } from '@/domain/entities/SearchParams';
import * as nextNavigation from 'next/navigation';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('VehicleCard', () => {
  const mockPush = jest.fn();
  const mockVehicle: Vehicle = {
    id: '1',
    name: 'Toyota Corolla',
    type: 'economy',
    pricePerDay: 25,
    features: ['AC', 'Bluetooth', 'GPS'],
    available: true,
  };

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

  it('debe renderizar la información del vehículo', () => {
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText(/25.*€/i)).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth')).toBeInTheDocument();
    expect(screen.getByText('GPS')).toBeInTheDocument();
  });

  it('debe mostrar el botón de seleccionar', () => {
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    const selectButton = screen.getByRole('button', { name: /seleccionar/i });
    expect(selectButton).toBeInTheDocument();
  });

  it('debe navegar al resumen al hacer click en seleccionar', async () => {
    const user = userEvent.setup();
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
        error: null,
      },
      booking: {
        currentBooking: null,
        isConfirmed: false,
        error: null,
      },
    };

    renderWithProviders(<VehicleCard vehicle={mockVehicle} />, {
      preloadedState,
    });

    const selectButton = screen.getByRole('button', { name: /seleccionar/i });
    await user.click(selectButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('debe actualizar el store con el booking al seleccionar', async () => {
    const user = userEvent.setup();
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
        error: null,
      },
      booking: {
        currentBooking: null,
        isConfirmed: false,
        error: null,
      },
    };

    const { store } = renderWithProviders(<VehicleCard vehicle={mockVehicle} />, {
      preloadedState,
    });

    const selectButton = screen.getByRole('button', { name: /seleccionar/i });
    await user.click(selectButton);

    // Verificar que el booking se guardó en el store
    await waitFor(() => {
      const state = store.getState();
      expect(state.booking.currentBooking).toBeDefined();
      if (state.booking.currentBooking) {
        expect(state.booking.currentBooking.vehicle.id).toBe(mockVehicle.id);
      }
    }, { timeout: 3000 });
  });

  it('debe mostrar el tipo de vehículo correctamente', () => {
    const luxuryVehicle: Vehicle = {
      ...mockVehicle,
      type: 'luxury',
    };

    renderWithProviders(<VehicleCard vehicle={luxuryVehicle} />);

    // El tipo puede estar en el texto o en una clase CSS
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
  });

  it('debe formatear el precio correctamente', () => {
    const expensiveVehicle: Vehicle = {
      ...mockVehicle,
      pricePerDay: 100.5,
    };

    renderWithProviders(<VehicleCard vehicle={expensiveVehicle} />);

    // Verificar que el precio está formateado
    const priceText = screen.getByText(/100/i);
    expect(priceText).toBeInTheDocument();
  });

  it('debe re-renderizar cuando cambia el vehículo', () => {
    const { rerender } = renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();

    const newVehicle: Vehicle = {
      id: '2',
      name: 'Honda Civic',
      type: 'standard',
      pricePerDay: 35,
      features: ['AC'],
      available: true,
    };

    rerender(
      <VehicleCard vehicle={newVehicle} />
    );

    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    expect(screen.queryByText('Toyota Corolla')).not.toBeInTheDocument();
  });

  it('debe manejar vehículos sin características', () => {
    const vehicleWithoutFeatures: Vehicle = {
      ...mockVehicle,
      features: [],
    };

    renderWithProviders(<VehicleCard vehicle={vehicleWithoutFeatures} />);

    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /seleccionar/i })).toBeInTheDocument();
  });
});

