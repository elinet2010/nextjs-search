import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import StoreProvider from '@/store/StoreProvider';
import { SkipLink } from '@/components/layout/SkipLink';

export const metadata: Metadata = {
  title: 'Búsqueda y reserva de alquiler de autos',
  description: 'Busca y selecciona el vehículo perfecto para tu viaje',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/img/rental-car-favicon.jpg" />
      </head>
      <body>
        <StoreProvider>
          <SkipLink />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

