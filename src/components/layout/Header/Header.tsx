import type { ReactNode } from 'react';
import styles from './Header.module.css';

export interface HeaderProps {
  children?: ReactNode;
  logo?: ReactNode;
}

export function Header({ children, logo }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        {logo && <div className={styles.logo}>{logo}</div>}
        {children && <nav className={styles.nav}>{children}</nav>}
      </div>
    </header>
  );
}


