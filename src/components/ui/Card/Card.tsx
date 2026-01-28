import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  fullWidth = false,
  className = '',
  ...props
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}


