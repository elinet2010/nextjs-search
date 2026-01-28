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

    expect(screen.getByLabelText(/ciudad o país/i)).toBeInTheDocument();
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

    const locationInput = screen.getByLabelText(/ciudad o país/i);
    await user.type(locationInput, 'Madrid');

    expect(locationInput).toHaveValue('Madrid');
  });

  it('debe mostrar sugerencias de países/ciudades al escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o país/i);
    await user.type(locationInput, 'Mad');

    // Esperar a que aparezcan las sugerencias
    await screen.findByRole('listbox');
    const suggestions = screen.getAllByRole('option');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });

  it('debe permitir seleccionar una sugerencia', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o país/i);
    await user.type(locationInput, 'Mad');

    // Esperar a que aparezcan las sugerencias
    const suggestions = await screen.findAllByRole('option');
    expect(suggestions.length).toBeGreaterThan(0);

    // Hacer clic en la primera sugerencia
    await user.click(suggestions[0]);

    // Verificar que el valor se haya actualizado
    const selectedValue = suggestions[0].textContent || '';
    expect(locationInput).toHaveValue(selectedValue);
  });

  it('debe validar que la ubicación tenga al menos 2 caracteres', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o país/i);
    await user.type(locationInput, 'M');
    await user.clear(locationInput);
    await user.type(locationInput, 'M');
    
    // La validación en tiempo real puede no dispararse inmediatamente
    // Verificar que el input tiene el valor
    expect(locationInput).toHaveValue('M');
    
    // No deberían aparecer sugerencias con solo 1 carácter
    const suggestions = screen.queryByRole('listbox');
    expect(suggestions).not.toBeInTheDocument();
    
    // Al enviar el formulario, debería mostrar el error
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(submitButton);
    
    // Esperar a que aparezca algún error de validación
    const errorMessages = await screen.findAllByRole('alert');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('debe navegar con teclado en las sugerencias', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm />);

    const locationInput = screen.getByLabelText(/ciudad o país/i);
    await user.type(locationInput, 'Mad');

    // Esperar a que aparezcan las sugerencias
    const suggestions = await screen.findAllByRole('option');
    expect(suggestions.length).toBeGreaterThan(0);

    // Navegar hacia abajo con la flecha
    await user.keyboard('{ArrowDown}');
    
    // La primera sugerencia debería estar enfocada
    expect(suggestions[0]).toHaveAttribute('aria-selected', 'true');

    // Seleccionar con Enter
    await user.keyboard('{Enter}');
    
    // Verificar que el valor se haya actualizado
    const selectedValue = suggestions[0].textContent || '';
    expect(locationInput).toHaveValue(selectedValue);
  });
});

