# Plan de Implementación - OutletRentalCars Search

## 📋 Resumen del Proyecto

Aplicación Next.js para búsqueda y selección de vehículos con arquitectura escalable, principios SOLID y mejores prácticas.

---

## 🏗️ Arquitectura Propuesta

### Separación de Capas

```
┌─────────────────────────────────────┐
│         PRESENTATION LAYER          │
│  (Pages, Components, UI)            │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         BUSINESS LOGIC LAYER        │
│  (Services, Use Cases, Redux)       │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         DATA LAYER                  │
│  (API Clients, Repositories)        │
└─────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
nextjs-search/
├── public/
│   └── assets/
│       ├── images/
│       └── icons/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Home (búsqueda)
│   │   ├── results/
│   │   │   └── page.tsx              # SSR para resultados
│   │   └── summary/
│   │       └── page.tsx              # Resumen de selección
│   │
│   ├── components/                   # Componentes UI reutilizables
│   │   ├── ui/                       # Componentes base (atoms)
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── DatePicker/
│   │   │   └── Card/
│   │   │
│   │   ├── features/                 # Componentes de features (molecules/organisms)
│   │   │   ├── SearchForm/
│   │   │   │   ├── SearchForm.tsx
│   │   │   │   ├── SearchForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── VehicleCard/
│   │   │   │   ├── VehicleCard.tsx
│   │   │   │   ├── VehicleCard.test.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── VehicleList/
│   │   │       ├── VehicleList.tsx
│   │   │       └── index.ts
│   │   │
│   │   └── layout/                   # Componentes de layout
│   │       ├── Header/
│   │       ├── Footer/
│   │       └── Container/
│   │
│   ├── domain/                       # Lógica de negocio (Clean Architecture)
│   │   ├── entities/                 # Entidades del dominio
│   │   │   ├── Vehicle.ts
│   │   │   ├── SearchParams.ts
│   │   │   └── Booking.ts
│   │   │
│   │   ├── repositories/             # Interfaces de repositorios
│   │   │   └── IVehicleRepository.ts
│   │   │
│   │   └── services/                 # Servicios de dominio
│   │       ├── VehicleService.ts
│   │       └── BookingService.ts
│   │
│   ├── infrastructure/               # Implementaciones concretas
│   │   ├── api/                      # Clientes API
│   │   │   ├── mock/
│   │   │   │   └── mockVehicleApi.ts
│   │   │   └── vehicleApiClient.ts
│   │   │
│   │   └── repositories/             # Implementaciones de repositorios
│   │       └── VehicleRepository.ts
│   │
│   ├── store/                        # Redux Store
│   │   ├── index.ts
│   │   ├── hooks.ts                  # Typed hooks
│   │   │
│   │   ├── slices/                   # Redux slices
│   │   │   ├── searchSlice.ts
│   │   │   ├── vehicleSlice.ts
│   │   │   └── bookingSlice.ts
│   │   │
│   │   └── thunks/                   # Async actions
│   │       ├── searchThunks.ts
│   │       └── vehicleThunks.ts
│   │
│   ├── types/                        # TypeScript types compartidos
│   │   └── index.ts
│   │
│   ├── utils/                        # Utilidades
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── styles/                       # Estilos globales
│       ├── globals.css
│       └── variables.css
│
├── __tests__/                        # Tests de integración
│
├── .env.local                        # Variables de entorno
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ Stack Tecnológico

### Core
- **Next.js 14+** (App Router)
- **TypeScript 5+**
- **React 18+**

### Estado
- **Redux Toolkit** (simplifica Redux)
- **Redux Thunk** (async actions)

### Estilos
- **CSS Modules** o **Tailwind CSS** (a decidir)
- **CSS Variables** para theming

### Testing (opcional para MVP)
- **Jest**
- **React Testing Library**

### Linting & Formatting
- **ESLint**
- **Prettier**

---

## 🎯 Aplicación de Principios SOLID

### 1. **Single Responsibility Principle (SRP)**
- Cada componente tiene una única responsabilidad
- Separación clara: UI, lógica de negocio, datos
- Ejemplo: `SearchForm` solo maneja el formulario, no la lógica de búsqueda

### 2. **Open/Closed Principle (OCP)**
- Componentes base extensibles sin modificación
- Uso de interfaces para repositorios (`IVehicleRepository`)
- Ejemplo: Fácil cambiar de mock API a API real sin tocar componentes

### 3. **Liskov Substitution Principle (LSP)**
- Implementaciones de repositorios intercambiables
- Componentes que aceptan props genéricas

### 4. **Interface Segregation Principle (ISP)**
- Interfaces específicas y pequeñas
- `IVehicleRepository` solo con métodos necesarios
- Props de componentes tipadas y mínimas

### 5. **Dependency Inversion Principle (DIP)**
- Dependencias hacia abstracciones (interfaces)
- Inyección de dependencias en servicios
- Ejemplo: `VehicleService` depende de `IVehicleRepository`, no de implementación concreta

---

## 📝 Plan de Implementación por Fases

### **Fase 1: Setup y Configuración Base**
1. ✅ Inicializar proyecto Next.js con TypeScript
2. ✅ Configurar ESLint y Prettier
3. ✅ Configurar estructura de carpetas
4. ✅ Instalar dependencias base (Redux Toolkit, Redux Thunk)
5. ✅ Configurar Tailwind CSS o CSS Modules
6. ✅ Setup de variables de entorno

### **Fase 2: Arquitectura y Dominio**
1. ✅ Definir entidades del dominio (`Vehicle`, `SearchParams`, `Booking`)
2. ✅ Crear interfaces de repositorios (`IVehicleRepository`)
3. ✅ Implementar mock API
4. ✅ Implementar repositorio concreto
5. ✅ Crear servicios de dominio

### **Fase 3: Redux Store**
1. ✅ Configurar Redux Store
2. ✅ Crear slices (search, vehicle, booking)
3. ✅ Implementar thunks para async actions
4. ✅ Crear typed hooks
5. ✅ Integrar Redux Provider en layout

### **Fase 4: Componentes UI Base**
1. ✅ Crear componentes base (Button, Input, DatePicker, Card)
2. ✅ Implementar accesibilidad básica
3. ✅ Aplicar estilos responsive
4. ✅ Crear componentes de layout

### **Fase 5: Feature - Búsqueda**
1. ✅ Crear `SearchForm` component
2. ✅ Implementar validación de formulario
3. ✅ Conectar con Redux (dispatch search action)
4. ✅ Navegación a página de resultados

### **Fase 6: Feature - Resultados (SSR)**
1. ✅ Crear página `/results` con SSR
2. ✅ Implementar `VehicleList` component
3. ✅ Crear `VehicleCard` component
4. ✅ Conectar con Redux para mostrar resultados
5. ✅ Manejar estados de loading y error
6. ✅ Implementar botón "Seleccionar"

### **Fase 7: Feature - Resumen**
1. ✅ Crear página `/summary`
2. ✅ Mostrar vehículo seleccionado
3. ✅ Mostrar precio final
4. ✅ Opción de volver a buscar

### **Fase 8: Mejoras y Pulido**
1. ✅ Mejorar UX (loading states, error handling)
2. ✅ Optimizar accesibilidad
3. ✅ Ajustes responsive
4. ✅ Validación de formularios mejorada
5. ✅ Manejo de errores global

### **Fase 9: Documentación**
1. ✅ Crear README.md completo
2. ✅ Documentar decisiones técnicas
3. ✅ Documentar arquitectura
4. ✅ Instrucciones de instalación y ejecución
5. ✅ Documentar integración con pasarela de pago (conceptual)

---

## 🔄 Flujo de Datos

```
Usuario llena formulario
    ↓
SearchForm valida y dispatch(searchVehicle(params))
    ↓
Redux Thunk ejecuta async action
    ↓
Thunk llama a VehicleService
    ↓
VehicleService usa IVehicleRepository
    ↓
Repository llama a API (mock)
    ↓
Datos fluyen de vuelta: API → Repository → Service → Redux → Component
    ↓
Component muestra resultados
```

---

## 🎨 Consideraciones de UX/UI

### Responsive Design
- Mobile First approach
- Breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)

### Accesibilidad
- Labels en todos los inputs
- Roles ARIA donde sea necesario
- Navegación por teclado funcional
- Contraste de colores adecuado
- Focus visible en elementos interactivos

### Estados de UI
- Loading states (skeletons o spinners)
- Error states (mensajes claros)
- Empty states (cuando no hay resultados)
- Success states (confirmaciones)

---

## 📦 Dependencias Estimadas

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "redux-thunk": "^2.4.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 🧪 Estrategia de Testing (Opcional para MVP)

- **Unit Tests**: Servicios, utilidades, validadores
- **Component Tests**: Componentes UI con React Testing Library
- **Integration Tests**: Flujos completos (búsqueda → resultados → selección)

---

## 📚 Documentación a Incluir en README

1. **Descripción del proyecto**
2. **Instalación y ejecución**
3. **Arquitectura y decisiones técnicas**
4. **Estructura de carpetas explicada**
5. **Principios SOLID aplicados**
6. **Flujo de la aplicación**
7. **Integración con pasarela de pago (conceptual)**
8. **Próximos pasos / mejoras futuras**

---

---

## ✅ Checklist de Validación

- [ ] Next.js configurado correctamente
- [ ] SSR funcionando en página de resultados
- [ ] Redux + Thunk implementado
- [ ] Separación de capas clara
- [ ] TypeScript sin errores
- [ ] Componentes reutilizables
- [ ] Responsive en todos los breakpoints
- [ ] Accesibilidad básica implementada
- [ ] Manejo de loading y errores
- [ ] README completo y claro
- [ ] Commits claros y ordenados

---

## 🚀 Próximos Pasos

1. Revisar y ajustar este plan según necesidades
2. Definir si usar Tailwind CSS o CSS Modules
3. Decidir estructura exacta de mock API
4. Definir diseño visual básico (colores, tipografía)
5. Comenzar con Fase 1: Setup

---

## 📝 Notas Adicionales

- Mantener commits atómicos y descriptivos
- Usar convenciones de nombres consistentes
- Documentar decisiones importantes en código
- Priorizar código limpio sobre optimizaciones prematuras
- Asegurar que el código sea fácil de entender y mantener





