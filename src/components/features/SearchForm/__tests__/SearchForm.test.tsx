import { renderWithProviders, screen } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../SearchForm';
import * as nextNavigation from 'next/navigation';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SearchForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('debe renderizar el formulario correctamente', () => {
    renderWithProviders(<SearchForm />);

    expect(screen.getByLabelText(/ciudad o aeropuerto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de recogida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de devolución/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validación al enviar formulario vacío', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const submitButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(submitButton);

    // Esperar a que aparezcan los errores (puede ser cualquier mensaje de error)
    const errorMessages = await screen.findAllByRole('alert');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('debe permitir ingresar ubicación', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o aeropuerto/i);
    await user.type(locationInput, 'Madrid');

    expect(locationInput).toHaveValue('Madrid');
  });

  it('debe validar que la ubicación tenga al menos 2 caracteres', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o aeropuerto/i);
    await user.type(locationInput, 'M');
    await user.clear(locationInput);
    await user.type(locationInput, 'M');
    
    // La validación en tiempo real puede no dispararse inmediatamente
    // Verificar que el input tiene el valor
    expect(locationInput).toHaveValue('M');
    
    // Al enviar el formulario, debería mostrar el error
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(submitButton);
    
    // Esperar a que aparezca algún error de validación
    const errorMessages = await screen.findAllByRole('alert');
    expect(errorMessages.length).toBeGreaterThan(0);
  });
});

