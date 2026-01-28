import type { InputHTMLAttributes } from 'react';
import { Input } from '../Input';

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  helperText,
  required = false,
  fullWidth = false,
  ...props
}: DatePickerProps) {
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForMinMax = (date: Date): string => {
    return formatDateForInput(date);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      onChange(null);
      return;
    }

    const date = new Date(inputValue);
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  };

  return (
    <Input
      type="date"
      label={label}
      value={formatDateForInput(value)}
      onChange={handleChange}
      min={minDate ? formatDateForMinMax(minDate) : undefined}
      max={maxDate ? formatDateForMinMax(maxDate) : undefined}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      {...props}
    />
  );
}

