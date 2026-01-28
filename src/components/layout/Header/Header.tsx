import type { ReactNode } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';

export interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Image src="https://dce.outletrentalcars.com/images/outlet/logo/logo.svg" alt="Outlet Rental Cars" width={100} height={30} />
        {children && <nav className={styles.nav}>{children}</nav>}
      </div>
    </header>
  );
}


