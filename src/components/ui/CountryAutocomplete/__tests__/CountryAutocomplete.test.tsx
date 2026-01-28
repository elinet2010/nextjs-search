import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { CountryAutocomplete } from '../CountryAutocomplete';

// Componente wrapper para simular un componente controlado
function ControlledCountryAutocomplete(props: Omit<React.ComponentProps<typeof CountryAutocomplete>, 'value' | 'onChange'>) {
  const [value, setValue] = useState('');
  return <CountryAutocomplete {...props} value={value} onChange={setValue} />;
}

describe('CountryAutocomplete', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    label: 'Ciudad o País',
    name: 'location',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el componente correctamente', () => {
    render(<CountryAutocomplete {...defaultProps} />);

    expect(screen.getByLabelText(/ciudad o país/i)).toBeInTheDocument();
  });

  it('debe mostrar el valor actual', () => {
    render(<CountryAutocomplete {...defaultProps} value="Madrid, España" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    expect(input).toHaveValue('Madrid, España');
  });

  it('debe llamar onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete {...defaultProps} />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('debe mostrar sugerencias cuando se escribe al menos 2 caracteres', async () => {
    const user = userEvent.setup();
    render(<ControlledCountryAutocomplete label="Ciudad o País" name="location" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    await waitFor(() => {
      const suggestions = screen.queryByRole('listbox');
      expect(suggestions).toBeInTheDocument();
    }, { timeout: 3000 });

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThanOrEqual(3);
  });

  it('no debe mostrar sugerencias con menos de 2 caracteres', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete {...defaultProps} />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'M');

    await waitFor(() => {
      const suggestions = screen.queryByRole('listbox');
      expect(suggestions).not.toBeInTheDocument();
    });
  });

  it('debe permitir seleccionar una sugerencia con clic', async () => {
    const user = userEvent.setup();
    render(<ControlledCountryAutocomplete label="Ciudad o País" name="location" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    }, { timeout: 3000 });

    const suggestions = screen.getAllByRole('option');
    const firstSuggestion = suggestions[0];
    const suggestionText = firstSuggestion.textContent || '';

    await user.click(firstSuggestion);

    await waitFor(() => {
      expect(input).toHaveValue(suggestionText);
    });
  });

  it('debe navegar con teclado en las sugerencias', async () => {
    const user = userEvent.setup();
    render(<ControlledCountryAutocomplete label="Ciudad o País" name="location" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Navegar hacia abajo - debería enfocar la primera sugerencia
    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      const suggestions = screen.getAllByRole('option');
      // Verificar que al menos una sugerencia tiene la clase focused o aria-selected
      const hasFocused = suggestions.some(s => 
        s.getAttribute('aria-selected') === 'true' || 
        s.className.includes('focused')
      );
      expect(hasFocused).toBe(true);
    });

    // Verificar que las sugerencias están disponibles para navegación
    const suggestions = screen.getAllByRole('option');
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('debe seleccionar sugerencia con Enter', async () => {
    const user = userEvent.setup();
    render(<ControlledCountryAutocomplete label="Ciudad o País" name="location" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    }, { timeout: 3000 });

    const suggestions = screen.getAllByRole('option');
    const firstSuggestionText = suggestions[0].textContent || '';

    // Navegar y seleccionar con Enter
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input).toHaveValue(firstSuggestionText);
    });
  });

  it('debe cerrar sugerencias con Escape', async () => {
    const user = userEvent.setup();
    render(<ControlledCountryAutocomplete label="Ciudad o País" name="location" />);

    const input = screen.getByLabelText(/ciudad o país/i);
    await user.type(input, 'Mad');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      const suggestions = screen.queryByRole('listbox');
      expect(suggestions).not.toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de error si se proporciona', () => {
    render(
      <CountryAutocomplete
        {...defaultProps}
        error="Este campo es requerido"
      />
    );

    expect(screen.getByText(/este campo es requerido/i)).toBeInTheDocument();
  });

  it('debe mostrar el label y el asterisco si es requerido', () => {
    render(<CountryAutocomplete {...defaultProps} required />);

    expect(screen.getByLabelText(/ciudad o país/i)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('debe aplicar estilos de error al input cuando hay error', () => {
    render(
      <CountryAutocomplete
        {...defaultProps}
        error="Error de validación"
      />
    );

    const input = screen.getByLabelText(/ciudad o país/i);
    expect(input).toHaveClass('error');
  });
});

