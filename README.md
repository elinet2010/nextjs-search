# Búsqueda y reserva de alquiler de autos

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



## 🔐 Integración con Pasarela de Pago (Conceptual)

### ¿Qué es una pasarela de pago?

Una **pasarela de pago** es un servicio externo (como Stripe o PayPal) que se encarga de procesar los pagos de forma segura.

### Opciones de pasarelas a considerar:

1. **Stripe** 
   - Muy popular y confiable
   - Excelente documentación para desarrolladores
   - Soporta múltiples países y monedas
   - Ideal para: proyectos que buscan una solución moderna y bien documentada

2. **PayPal**
   - Amplia aceptación mundial
   - Los usuarios pueden pagar sin ingresar tarjeta (si tienen cuenta PayPal)
   - Ideal para: proyectos que buscan máxima aceptación del usuario

3. **Mercado Pago**
   - Especializado en mercado latinoamericano
   - Soporte para métodos de pago locales
   - Ideal para: proyectos enfocados en usuarios de Latinoamérica

### Flujo de pago paso a paso:

**Paso 1: Usuario selecciona vehículo**
- El usuario completa la búsqueda y elige un vehículo
- Ve el resumen de su reserva con el precio total

**Paso 2: Usuario hace clic en "Proceder al pago"**
- En la página de resumen (`/summary`), aparece el botón para pagar
- El sistema prepara toda la información necesaria

**Paso 3: Redirección a la pasarela de pago**
- El usuario es redirigido a la plataforma de pago (Stripe, PayPal, etc.)
- Se envía la siguiente información:
  - 💰 **Monto total** a pagar
  - 🚗 **Información del vehículo** (modelo, tipo, etc.)
  - 📅 **Fechas de reserva** (fecha de recogida y devolución)
  - 👤 **Datos del cliente** (nombre, email, etc.)

**Paso 4: Usuario completa el pago**
- El usuario ingresa sus datos de pago en la plataforma segura
- La pasarela procesa el pago y valida los fondos

**Paso 5: Confirmación del pago**
- La pasarela envía una confirmación a nuestro sistema
- Nuestro sistema actualiza el estado de la reserva (de "pendiente" a "confirmada")

**Paso 6: Notificación al cliente**
- Se envía un email de confirmación al cliente
- El cliente puede ver su reserva confirmada en la aplicación

### Consideraciones técnicas para implementación:

> **Nota para desarrolladores:** Estos son los aspectos técnicos que deben considerarse al implementar la integración.

- **Endpoint seguro para procesar pago**
  - Crear una ruta API (`/api/payment/process`) que maneje la creación de la sesión de pago
  - Validar que todos los datos sean correctos antes de enviar a la pasarela
  - Usar autenticación para proteger el endpoint

- **Webhooks para confirmaciones**
  - Configurar endpoints que reciban notificaciones de la pasarela cuando un pago se complete
  - Ejemplo: `/api/payment/webhook` que recibe eventos de Stripe/PayPal
  - Validar la firma del webhook para asegurar que viene de la pasarela legítima

- **Manejo de estados de pago**
  - Definir estados claros: `pending` (pendiente), `completed` (completado), `failed` (fallido)
  - Actualizar el estado en la base de datos según la respuesta de la pasarela
  - Manejar casos de error (pago rechazado, tarjeta sin fondos, etc.)

- **Validación de montos**
  - Verificar que el monto enviado a la pasarela coincida con el calculado en nuestro sistema
  - Prevenir manipulación de precios antes de enviar a la pasarela
  - Recalcular el monto en el servidor, no confiar solo en el valor del cliente
