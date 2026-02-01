import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('debe renderizar correctamente', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('debe aplicar la variante primary por defecto', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('debe aplicar diferentes variantes', () => {
    const { rerender } = render(<Button variant="secondary">Click me</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');

    rerender(<Button variant="outline">Click me</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('outline');
  });

  it('debe aplicar diferentes tamaños', () => {
    const { rerender } = render(<Button size="sm">Click me</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('sm');

    rerender(<Button size="lg">Click me</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('lg');
  });

  it('debe estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('debe mostrar estado de loading', () => {
    render(<Button isLoading>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('debe llamar onClick cuando se hace click', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debe aplicar fullWidth cuando se especifica', () => {
    render(<Button fullWidth>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('fullWidth');
  });
});





