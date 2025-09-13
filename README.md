# 📋 Gestor de Tareas - Task Manager App

Una aplicación completa de gestión de tareas construida con React, TypeScript, y tecnologías modernas. Incluye todas las características avanzadas para una experiencia de usuario excepcional.

![Task Manager](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características Implementadas

### ✅ Funcionalidades Core
- **CRUD Completo**: Crear, editar, eliminar tareas
- **Estados de Tareas**: Pendiente, En progreso, Completada
- **Filtrado Avanzado**: Por estado, categoría, prioridad, persona asignada
- **Búsqueda en Tiempo Real**: Búsqueda instantánea con debounce
- **Persistencia Local**: Almacenamiento automático en localStorage

### ✅ Características Avanzadas
- **Drag & Drop**: Reordenar tareas arrastrando (disponible con orden personalizado)
- **Modo Oscuro/Claro**: Cambio dinámico de tema
- **Notificaciones**: Feedback visual con react-hot-toast
- **Interfaz Responsiva**: Optimizada para móvil, tablet y desktop
- **Estadísticas**: Dashboard completo con métricas y gráficos
- **Sistema de Etiquetas**: Organización avanzada con tags

### 📊 Sistema de Datos
- **Prioridades**: Baja, Media, Alta, Urgente
- **Categorías**: Trabajo, Personal, Compras, Salud, Educación, Otros
- **Fechas de Vencimiento**: Con alertas para tareas vencidas
- **Asignación**: Tareas asignables a personas específicas
- **Ordenamiento**: Por fecha, prioridad, título, orden personalizado

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.2**: Biblioteca principal con hooks modernos
- **TypeScript 5.2**: Tipado estático para mayor robustez
- **Vite 5.0**: Build tool rápido y moderno

### Manejo de Estado
- **React Context**: Estado global con useReducer
- **useCallback & useMemo**: Optimizaciones de rendimiento
- **Custom Hooks**: Lógica reutilizable

### UI/UX
- **CSS Variables**: Sistema de diseño con temas dinámicos
- **Lucide React**: Iconografía moderna y consistente
- **React Hot Toast**: Sistema de notificaciones elegante
- **@dnd-kit**: Drag & drop accesible y fluido

### Utilidades
- **localStorage**: Persistencia de datos local
- **Debounce**: Optimización de búsquedas
- **Date Formatting**: Manejo inteligente de fechas
- **Validación**: Sistema robusto de validación de formularios

## 📁 Estructura del Proyecto

```
task-manager-app/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Componentes React
│   │   ├── TaskCard.tsx    # Tarjeta individual de tarea
│   │   ├── TaskForm.tsx    # Formulario de creación/edición
│   │   ├── TaskList.tsx    # Lista con drag & drop
│   │   ├── FilterBar.tsx   # Barra de filtros y búsqueda
│   │   └── StatsModal.tsx  # Modal de estadísticas
│   ├── context/
│   │   └── AppContext.tsx  # Estado global con Context API
│   ├── types/
│   │   └── index.ts        # Definiciones TypeScript
│   ├── utils/
│   │   ├── index.ts        # Utilidades generales
│   │   └── sampleData.ts   # Datos de ejemplo
│   ├── styles/
│   │   └── index.css       # Estilos globales y sistema de diseño
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 16.0 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd task-manager-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

## 🎯 Cómo Usar la Aplicación

### Gestión Básica de Tareas

1. **Crear Tarea**: Haz clic en "Nueva Tarea" para abrir el formulario
2. **Editar Tarea**: Haz clic en cualquier tarea o en el ícono de edición
3. **Cambiar Estado**: Haz clic en el círculo de estado para ciclar entre estados
4. **Eliminar Tarea**: Haz clic en el ícono de basura

### Funcionalidades Avanzadas

1. **Filtrar Tareas**:
   - Usa la barra de búsqueda para filtrar por texto
   - Haz clic en "Filtros" para opciones avanzadas
   - Filtra por estado, categoría, prioridad

2. **Reordenar Tareas**:
   - Cambia el ordenamiento a "Orden personalizado"
   - Arrastra las tareas para reordenar

3. **Ver Estadísticas**:
   - Haz clic en el ícono de gráfico para ver métricas detalladas
   - Visualiza progreso, tareas vencidas, distribución por categoría

4. **Cambiar Tema**:
   - Haz clic en el ícono de luna/sol para alternar entre modo claro y oscuro

### Características del Formulario

- **Validación en Tiempo Real**: Errores mostrados instantáneamente
- **Campos Inteligentes**: Autocompletado y sugerencias
- **Etiquetas Dinámicas**: Agregar múltiples tags presionando Enter
- **Fechas Intuitivas**: Selector de fecha/hora con validación
- **Autoguardado**: Las preferencias se guardan automáticamente

## 🎨 Sistema de Diseño

### Variables CSS
El proyecto utiliza un sistema robusto de variables CSS para:
- **Colores**: Paleta consistente con soporte para temas
- **Espaciado**: Sistema de espaciado uniforme
- **Tipografía**: Escalas tipográficas consistentes
- **Sombras**: Niveles de elevación definidos
- **Animaciones**: Transiciones fluidas

### Responsividad
- **Mobile First**: Diseñado primero para móvil
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Grid Adaptativo**: Columnas que se ajustan al dispositivo
- **Touch Friendly**: Elementos optimizados para touch

### Accesibilidad
- **ARIA Labels**: Etiquetas descriptivas para lectores de pantalla
- **Focus Management**: Navegación por teclado optimizada
- **Contraste**: Cumple estándares WCAG
- **Semantic HTML**: Estructura semánticamente correcta

## 🔧 Configuración Avanzada

### Personalizar Temas
Edita las variables CSS en `src/styles/index.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  /* ... más variables */
}
```

### Agregar Categorías
Modifica `src/types/index.ts`:

```typescript
export type TaskCategory = 'work' | 'personal' | 'nueva-categoria';
```

### Datos de Ejemplo
Los datos de ejemplo se cargan automáticamente en la primera ejecución desde `src/utils/sampleData.ts`.

## 📈 Optimizaciones de Rendimiento

- **Code Splitting**: Carga bajo demanda
- **React.memo**: Componentes memorizados
- **useCallback/useMemo**: Prevención de re-renders innecesarios
- **Debounce**: Búsquedas optimizadas
- **Virtual Scrolling**: Para listas grandes (futuro)

## 🧪 Testing (Pendiente)

Estructura preparada para testing:
- Unit tests con Jest
- Component tests con React Testing Library
- E2E tests con Playwright

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Despliegue en Netlify/Vercel
1. Conectar repositorio
2. Comando de build: `npm run build`
3. Directorio de publicación: `dist`

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📋 Roadmap

### Características Futuras
- [ ] Sincronización en la nube
- [ ] Colaboración en tiempo real
- [ ] Integración con calendarios
- [ ] Notificaciones push
- [ ] Exportar/Importar tareas
- [ ] Plantillas de tareas
- [ ] Comentarios y adjuntos
- [ ] API REST
- [ ] Aplicación móvil nativa

### Mejoras Técnicas
- [ ] Testing completo
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Performance optimizations
- [ ] A11y audit completo
- [ ] Internacionalización (i18n)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Créditos

Desarrollado con ❤️ usando:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Lucide React](https://lucide.dev/)
- [dnd-kit](https://dndkit.com/)
- [React Hot Toast](https://react-hot-toast.com/)

---

⭐ ¡Si te gusta este proyecto, no olvides darle una estrella!

🐛 ¿Encontraste un bug? [Crea un issue](../../issues/new)

💡 ¿Tienes una idea? [Compártela](../../discussions/new)#   i n t e n t o - d e - r e a c t  
 #   i n t e n t o - d e - r e a c t  
 