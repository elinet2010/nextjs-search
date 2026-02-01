import type { ReactNode } from 'react';
import styles from './Footer.module.css';

export interface FooterProps {
  children?: ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {children || (
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Búsqueda y reserva de alquiler de autos. Todos los derechos
            reservados.
          </p>
        )}
      </div>
    </footer>
  );
}





