# 🎯 Sistema de Sorteo de Rifas

Un sistema profesional y moderno para gestionar sorteos de rifas con animaciones espectaculares, desarrollado con Vue 3, Tailwind CSS y Pinia.

## ✨ Características

### 🎨 Interfaz Moderna
- **Diseño Responsivo**: Se adapta perfectamente a cualquier dispositivo
- **Animaciones Profesionales**: Efectos visuales con GSAP para una experiencia inmersiva
- **UI/UX Intuitiva**: Interfaz limpia y fácil de usar
- **Tema Personalizable**: Colores y estilos configurables

### 📊 Gestión Completa
- **Carga de Rifas**: Individual o en lote con validación
- **Gestión de Premios**: Con imágenes, categorías y orden de sorteo
- **Estadísticas en Tiempo Real**: Progreso y métricas del sorteo
- **Búsqueda y Filtros**: Encuentra rápidamente lo que necesitas

### 🎲 Sorteo Profesional
- **Animaciones de Ruleta**: Efectos visuales espectaculares
- **Algoritmo Justo**: Fisher-Yates para mezcla aleatoria
- **Progreso Visual**: Barra de progreso y estadísticas
- **Historial Completo**: Registro de todos los sorteos

### 🔧 Funcionalidades Avanzadas
- **Exportación de Resultados**: Genera reportes completos
- **Persistencia de Datos**: Los datos se mantienen entre sesiones
- **Validación Robusta**: Prevención de errores y duplicados
- **Modo Responsivo**: Funciona perfectamente en móviles

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd sistema-rifas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase (Opcional)**
Si quieres usar Firebase para persistencia de datos:
```bash
# Crear archivo src/firebase/config.js
export const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
sistema-rifas/
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes base reutilizables
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   └── Modal.vue
│   │   ├── rifa/              # Componentes de gestión de rifas
│   │   │   ├── RifaForm.vue
│   │   │   └── RifaList.vue
│   │   ├── premio/            # Componentes de gestión de premios
│   │   │   ├── PremioForm.vue
│   │   │   └── PremioList.vue
│   │   └── sorteo/            # Componentes del sorteo
│   │       └── SorteoView.vue
│   ├── pages/                 # Páginas principales
│   │   ├── Home.vue
│   │   ├── CargarRifas.vue
│   │   ├── CargarPremios.vue
│   │   └── Sorteo.vue
│   ├── stores/                # Estado global con Pinia
│   │   ├── rifaStore.js
│   │   ├── premioStore.js
│   │   └── sorteoStore.js
│   ├── composables/           # Lógica reutilizable
│   │   ├── useAnimations.js
│   │   └── useSorteo.js
│   ├── router/                # Configuración de rutas
│   │   └── index.js
│   └── firebase/              # Configuración de Firebase
│       └── config.js
├── public/                    # Archivos estáticos
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
└── package.json
```

## 🎮 Uso del Sistema

### 1. Página Principal (Home)
- **Dashboard completo** con estadísticas en tiempo real
- **Acceso rápido** a todas las funcionalidades
- **Vista previa** del próximo premio a sortear
- **Historial** de últimos resultados

### 2. Cargar Rifas
- **Formulario individual** para agregar rifas una por una
- **Carga en lote** para importar múltiples rifas
- **Validación automática** de datos
- **Lista con filtros** y búsqueda avanzada

### 3. Cargar Premios
- **Gestión completa** de premios con imágenes
- **Categorización** y orden de sorteo
- **Validación de valores** y descripciones
- **Vista previa** de imágenes

### 4. Sorteo
- **Interfaz inmersiva** con animaciones
- **Progreso visual** del sorteo
- **Efectos de celebración** para ganadores
- **Controles intuitivos** para el presentador

## 🎨 Personalización

### Colores y Temas
Edita `tailwind.config.js` para personalizar:
```javascript
colors: {
  primary: {
    500: '#tu-color-primario',
    // ... más variantes
  }
}
```

### Animaciones
Modifica las animaciones en `src/style.css`:
```css
@keyframes tuAnimacion {
  /* Define tu animación personalizada */
}
```

### Componentes
Todos los componentes están en `src/components/` y son fácilmente modificables.

## 🔧 Configuración Avanzada

### Firebase (Opcional)
Para persistencia de datos en la nube:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Obtén las credenciales de configuración
3. Actualiza `src/firebase/config.js`
4. Los stores automáticamente usarán Firebase

### Variables de Entorno
Crea un archivo `.env`:
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
```

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop**: Experiencia completa con todas las funcionalidades
- **Tablet**: Interfaz adaptada con controles táctiles
- **Mobile**: Versión simplificada para presentaciones

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

### Netlify
```bash
npm run build
# Arrastra la carpeta dist/ a Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🐛 Solución de Problemas

### Error de Dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Error de Animaciones
Verifica que GSAP esté instalado:
```bash
npm install gsap
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

## 🎉 Agradecimientos

- **Vue.js** por el framework increíble
- **Tailwind CSS** por los estilos hermosos
- **GSAP** por las animaciones espectaculares
- **Pinia** por el manejo de estado
- **Vite** por el build tool rápido

---

**¡Disfruta creando sorteos increíbles! 🎯✨**
