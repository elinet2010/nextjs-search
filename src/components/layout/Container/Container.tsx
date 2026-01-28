import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.css';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({
  children,
  size = 'lg',
  className = '',
  ...props
}: ContainerProps) {
  const containerClasses = [
    styles.container,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

