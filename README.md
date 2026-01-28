# OutletRentalCars - Búsqueda de Vehículos

Aplicación Next.js para búsqueda y selección de vehículos con arquitectura escalable, principios SOLID y mejores prácticas.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar en producción
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/              # Next.js App Router (pages)
├── components/       # Componentes UI reutilizables
├── domain/          # Lógica de negocio (entities, services)
├── infrastructure/  # Implementaciones (API, repositories)
├── store/           # Redux (slices, thunks)
├── types/           # TypeScript types compartidos
├── utils/           # Utilidades
└── styles/          # Estilos globales y variables CSS
```

## 🛠️ Stack Tecnológico

- **Next.js 14+** (App Router) con SSR
- **TypeScript 5+**
- **Redux Toolkit** para estado global
- **CSS Modules** para estilos
- **Jest** + **React Testing Library** para pruebas unitarias

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run type-check` - Verifica tipos de TypeScript
- `npm test` - Ejecuta pruebas unitarias
- `npm run test:watch` - Ejecuta pruebas en modo watch
- `npm run test:coverage` - Ejecuta pruebas con reporte de cobertura


## 🧪 Pruebas Unitarias

El proyecto incluye configuración completa de Jest y React Testing Library para pruebas unitarias.

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch (re-ejecuta al cambiar archivos)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

### Estructura de Pruebas

Las pruebas se organizan junto a los archivos que prueban:

```
src/
├── components/
│   └── ui/
│       └── Button/
│           ├── Button.tsx
│           └── __tests__/
│               └── Button.test.tsx
├── utils/
│   ├── validators.ts
│   └── __tests__/
│       └── validators.test.ts
└── domain/
    └── services/
        ├── VehicleService.ts
        └── __tests__/
            └── VehicleService.test.ts
```

### Helpers de Testing

El proyecto incluye `src/utils/test-utils.tsx` con helpers para:

- **`renderWithProviders`**: Renderiza componentes con Redux Provider
- **`createTestStore`**: Crea un store de Redux para testing

Ejemplo de uso:

```tsx
import { renderWithProviders, screen } from '@/utils/test-utils';
import { MyComponent } from './MyComponent';

test('mi componente', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```


