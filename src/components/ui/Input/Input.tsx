import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  required = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const inputClasses = [
    styles.input,
    error && styles.error,
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-label="required">
            *
          </span>
        )}
      </label>
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <input
          id={inputId}
          className={inputClasses}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}





