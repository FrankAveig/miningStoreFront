#  Mining Store Frontend
---

## 🚀 Sobre el Proyecto

**CryptoChile** es una plataforma de administración para tienda de minería de criptomonedas. El sistema permite gestionar usuarios, criptomonedas, servicios de minería, catálogo de productos, precios de electricidad y configuraciones del sistema.

### Tecnologías Principales
- **React 19.1.0** - Framework principal
- **Vite 6.3.5** - Build tool y dev server
- **React Router 7.6.2** - Manejo de rutas
- **Axios** - Cliente HTTP
- **SCSS/Sass** - Estilos con preprocesador
- **PrimeReact** - Librería de componentes UI
- **Chart.js + React ChartJS 2** - Gráficos y visualizaciones
- **React Icons** - Iconos
- **Leaflet + React Leaflet** - Mapas interactivos
- **React Cropper** - Editor de imágenes

---

## 📁 Estructura del Proyecto

### **`src/` - Código fuente principal**
```
src/
├── components/          # Componentes reutilizables (UI, forms, data-display)
├── context/            # Contextos de React (Auth, Toast)
├── hooks/              # Hooks personalizados
├── modules/            # Módulos de la aplicación
├── routes/             # Configuración de rutas
├── services/           # Servicios y APIs
├── styles/             # Variables y estilos globales
└── utils/              # Utilidades y helpers
```

### **`src/modules/` - Módulos principales**
```
modules/
└── admin/                          # Panel de administración
    ├── components/                 # Componentes del admin (Header, Sidebar)
    ├── layout/                     # AdminLayout
    ├── pages/                      # Páginas del sistema
    │   ├── user/                   # Gestión de usuarios
    │   ├── cryptocurrency/         # Gestión de criptomonedas
    │   ├── service/                # Gestión de servicios de minería
    │   ├── catalogCategory/        # Gestión de categorías del catálogo
    │   ├── catalog/                # Gestión de productos del catálogo
    │   ├── electricityPrice/       # Gestión de precios de electricidad
    │   ├── settings/               # Configuraciones del sistema
    │   ├── home/                   # Dashboard principal
    │   ├── login/                  # Página de inicio de sesión
    │   └── profile/                # Perfil de usuario
    └── services/                   # Servicios/APIs del admin
```

---

## 🛣️ Sistema de Rutas - Explicación Detallada

### **¿Cómo funciona el enrutamiento?**

El proyecto usa **React Router v6** con un sistema de rutas anidadas y protegidas. Las rutas están separadas por funcionalidad y nivel de acceso.

### **1. Estructura Principal** (`/src/App.jsx`)
```jsx
function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<AdminRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  )
}
```

**Puntos clave:**
- **ToastProvider**: Envuelve toda la app para notificaciones globales
- **HashRouter**: Usa `#` en las URLs (ej: `/#/admin/usuarios`)
- **Rutas anidadas**: `/*` permite que AdminRoutes maneje todas las subrutas
- **Arquitectura simplificada**: Todo el sistema está bajo AdminRoutes

### **2. Sistema de Rutas** (`/src/routes/AdminRoutes.jsx`)
El sistema cuenta con rutas públicas (login) y rutas protegidas (admin panel).

#### **Rutas Públicas (sin autenticación)**
```jsx
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
```

**Características:**
- Redirigen automáticamente a `/admin/home` si el usuario ya está autenticado
- No requieren token de acceso

### **3. Rutas Protegidas (requieren autenticación)**
Todas las rutas administrativas están protegidas y requieren autenticación:

```jsx
<Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  {/* Dashboard */}
  <Route path="/home" element={<Home />} />
  
  {/* Usuarios */}
  <Route path="/usuarios" element={<Users />} />
  <Route path="/nuevo-usuario" element={<NewUser />} />
  <Route path="/usuarios/:id" element={<EditUser />} />
  
  {/* Criptomonedas */}
  <Route path="/criptomonedas" element={<Cryptocurrencies />} />
  <Route path="/nueva-criptomoneda" element={<NewCryptocurrency />} />
  <Route path="/criptomonedas/:id" element={<EditCryptocurrency />} />
  
  {/* Servicios */}
  <Route path="/servicios" element={<Services />} />
  <Route path="/nuevo-servicio" element={<NewService />} />
  <Route path="/servicios/:id" element={<EditService />} />
  
  {/* Categorías del Catálogo */}
  <Route path="/categorias" element={<CatalogCategories />} />
  <Route path="/nueva-categoria" element={<NewCatalogCategory />} />
  <Route path="/categorias/:id" element={<EditCatalogCategory />} />
  
  {/* Catálogo de Productos */}
  <Route path="/catalogo" element={<Catalog />} />
  <Route path="/nuevo-producto" element={<NewCatalog />} />
  <Route path="/catalogo/:id" element={<EditCatalog />} />
  
  {/* Precios de Electricidad */}
  <Route path="/precios-electricidad" element={<ElectricityPrices />} />
  <Route path="/nuevo-precio-electricidad" element={<NewElectricityPrice />} />
  <Route path="/precios-electricidad/:id" element={<EditElectricityPrice />} />
  
  {/* Configuraciones */}
  <Route path="/configuraciones" element={<Settings />} />
</Route>
```

**Sistema de Protección:**
- **ProtectedRoute**: Verifica autenticación antes de renderizar
- **PublicRoute**: Redirige usuarios autenticados al admin
- **AdminLayout**: Layout común con Header y Sidebar para todas las páginas protegidas

### **4. Componentes de Protección**

#### **ProtectedRoute** - Rutas que requieren login
```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

#### **PublicRoute** - Rutas que redirigen si ya estás logueado
```jsx
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/admin/home" replace />;
  }
  return children;
};
```

### **5. Layout Anidado**
```jsx
<Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route path="/home" element={<Home />} />
  <Route path="/usuarios" element={<Users />} />
</Route>
```

**¿Cómo funciona?**
- **AdminLayout** se renderiza siempre
- **Outlet** en AdminLayout muestra las páginas hijas
- **Navegación** mantiene el sidebar y header

---

## 🎨 Sistema de Diseño

### **Variables SCSS** (`/src/styles/_variables.scss`)
```scss
// Colores principales
$primary-color: #320935;         // Morado oscuro
$secondary-color: #00d4ff;       // Cyan brillante
$accent-color: #ff9800;          // Naranja
$background-color: #1F1740;      // Fondo morado oscuro
$background-side-top-bar: #320935; // Sidebar y topbar

// Colores de interacción
$focus-color: #ff9800;           // Naranja para focus
$hover-color: #ff9800;           // Naranja para hover
$button-color: #320935;          // Morado para botones
$header-table-color: #320935;    // Morado para headers de tabla

// Colores funcionales
$black-color: #212533;
$white-color: #fff;
$gray-color: #ccc;
$disabled-color: #8f8f8f;
$error-color: #ad4044;
$success-color: #008000;
$warning-color: #ffcc05;
$info-color: #72bbff;

// Colores de texto
$text-color: #2B303F;
$text-color-secondary: #212533;
$secondary-text-color: #6c757d;
$text-muted-color: #6c757d;

// Espaciado
$spacing-xs: 0.3125rem;      // 5px
$spacing-s: 0.625rem;        // 10px
$spacing-m: 1.25rem;         // 20px
$spacing-l: 2.5rem;          // 40px
$spacing-xl: 3.75rem;        // 60px
$spacing-xxl: 5rem;          // 80px

// Tipografía
$font-size-xs: 0.75rem;      // 12px
$font-size-s: 0.875rem;      // 14px
$font-size-m: 1rem;          // 16px
$font-size-l: 1.25rem;       // 20px
$font-size-xl: 1.5rem;       // 24px
$font-size-xxl: 2rem;        // 32px

// Otros
$border-radius: 12px;
$transition: all 0.3s ease;
$font-family: "Roboto", sans-serif;
```

### **Componentes UI** (`/src/components/ui/`)
#### Componentes Base:
- **Button** - Botones con variantes (primary, secondary, etc.)
- **Input** - Campos de texto básicos
- **Select** - Selectores desplegables
- **Textarea** - Áreas de texto multilinea
- **Checkbox** - Casillas de verificación
- **Radio** - Botones de radio
- **Switch** - Interruptores on/off
- **Date** - Selector de fechas
- **Toast** - Notificaciones emergentes
- **Modal** - Ventanas modales
- **EditableTable** - Tablas editables

#### Componentes de Formulario (`/src/components/form/`):
- **InputField** - Campo de texto con label y validación
- **SelectField** - Selector con label y validación
- **InfiniteSelect** - Selector con scroll infinito
- **TextareaField** - Área de texto con label y validación
- **CheckboxField** - Checkbox con label
- **RadioField** - Radio button con label
- **DateField** - Selector de fecha con label
- **EditableTableField** - Campo de tabla editable
- **FormControl** - Wrapper de control de formulario
- **FormSkeleton** - Esqueleto de carga para formularios

#### Componentes de Visualización (`/src/components/data-display/`):
- **PaginatedTable** - Tabla con paginación automática
- **BreadCrumb** - Navegación de migas de pan
- **FilterBar** - Barra de filtros de búsqueda
- **ConfirmationModal** - Modal de confirmación de acciones
- **FileDropzone** - Zona de arrastre para subir archivos (con cropper)

---

## 🔧 Patrones de Desarrollo

### **1. Estructura de Módulos**
Cada módulo de página sigue esta estructura estándar:
```
modulo/
├── components/              # Componentes específicos del módulo
│   ├── ModuloForm.jsx      # Formulario de creación/edición
│   └── moduloForm.module.scss
├── adapters/               # Transformadores de datos del backend
│   ├── modulo.adapter.list.js   # Para listados
│   └── modulo.adapter.get.js    # Para obtener uno
├── constants/              # Constantes (columnas de tabla, etc.)
│   └── moduloConstants.js
├── Modulos.jsx            # Página de listado
├── NewModulo.jsx          # Página de creación
├── EditModulo.jsx         # Página de edición
└── modulos.module.scss    # Estilos del módulo
```

### **2. Módulos Disponibles**

#### **Usuarios** (`/modules/admin/pages/user/`)
- Gestión completa de usuarios administradores
- Roles y permisos
- Activación/desactivación de usuarios
- CRUD completo

#### **Criptomonedas** (`/modules/admin/pages/cryptocurrency/`)
- Gestión de criptomonedas soportadas
- Información de cada criptomoneda
- CRUD completo

#### **Servicios** (`/modules/admin/pages/service/`)
- Gestión de servicios de minería
- Planes y paquetes de minería
- CRUD completo

#### **Categorías del Catálogo** (`/modules/admin/pages/catalogCategory/`)
- Gestión de categorías de productos
- Organización jerárquica
- CRUD completo

#### **Catálogo de Productos** (`/modules/admin/pages/catalog/`)
- Gestión de productos de minería (hardware, equipos, etc.)
- Asociación con criptomonedas
- Imágenes y descripciones
- CRUD completo

#### **Precios de Electricidad** (`/modules/admin/pages/electricityPrice/`)
- Gestión de tarifas eléctricas por región
- Historial de precios
- CRUD completo

#### **Configuraciones** (`/modules/admin/pages/settings/`)
- Configuraciones globales del sistema
- Parámetros generales

### **3. Adaptadores**
Los adaptadores transforman las respuestas del backend al formato que necesita el frontend:

#### **Adaptador de Lista** (`modulo.adapter.list.js`)
```javascript
// Ejemplo: user.adapter.list.js
export const userAdapterList = (data) => {
  return data.data?.data?.map((user) => ({
    id: user.id,
    name: user.full_name,
    email: user.email,
    status: user.status === 'active' ? 'Activo' : 'Inactivo',
    is_active: user.status === 'active'
  }));
};
```

#### **Adaptador de Detalle** (`modulo.adapter.get.js`)
```javascript
// Ejemplo: user.adapter.get.js
export const userAdapterGet = (data) => {
  const user = data?.data?.data;
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    status: user.status === 'active' ? 'active' : 'inactive',
    role: user.role
  };
};
```

### **4. Servicios**
Los servicios manejan las llamadas a la API del backend:

```javascript
// Ejemplo: users.service.js
import api from '@/services/interceptors/axiosConfig';

export const getUsers = async (page = 1, limit = 20) => {
  const response = await api.get(`/api/v1/user/admin/users?page=${page}&per_page=${limit}`);
  return response;
};

export const getUser = async (id) => {
  const response = await api.get(`/api/v1/user/admin/users/${id}`);
  return response;
};

export const createUser = async (data) => {
  const response = await api.post('/api/v1/user/admin/users', data);
  return response;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/api/v1/user/admin/users/${id}`, data);
  return response;
};

export const toggleUserStatus = async (id) => {
  const response = await api.delete(`/api/v1/user/admin/users/${id}`);
  return response;
};
```

#### **Servicios Disponibles** (`/modules/admin/services/`)
- **users.service.js** - Gestión de usuarios
- **cryptocurrencies.service.js** - Gestión de criptomonedas
- **services.service.js** - Gestión de servicios de minería
- **catalogCategories.service.js** - Gestión de categorías
- **catalog.service.js** - Gestión de catálogo de productos
- **electricityPrices.service.js** - Gestión de precios de electricidad
- **settings.service.js** - Gestión de configuraciones

#### **Interceptor de Axios** (`/services/interceptors/axiosConfig.js`)
Configuración centralizada de Axios con:
- Base URL automática
- Interceptor de requests (agrega token)
- Interceptor de responses (manejo de errores)
- Redirección automática en caso de no autenticación

---

## 🔐 Sistema de Contexto

El proyecto utiliza tres contextos principales de React para manejar el estado global:

### **1. AuthContext** (`/src/context/AuthContext.jsx`)
```jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    // Lógica de login
    const response = await loginService(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Funcionalidades:**
- **Estado de autenticación**: `user`, `token`
- **Métodos de autenticación**: `login`, `logout`
- **Verificación**: `isAuthenticated()`
- **Persistencia**: Guarda token en localStorage

**Uso:**
```jsx
import { useAuth } from '@/context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### **2. CollaboratorAuthContext** (`/src/context/CollaboratorAuthContext.jsx`)
Contexto secundario para autenticación de colaboradores (si aplica).

**Funcionalidades:**
- Similar a AuthContext pero para usuarios tipo colaborador
- Sistema de autenticación independiente
- Persistencia separada

### **3. ToastContext** (`/src/context/ToastContext.jsx`)
```jsx
export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', title = '') => {
    const id = Date.now();
    const newToast = { id, message, type, title };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};
```

**Funcionalidades:**
- **Notificaciones**: `showToast(message, type, title, duration)`
- **Tipos**: `info`, `success`, `error`, `warning`
- **Auto-eliminación**: Desaparecen después de 3 segundos (configurable)
- **Cola de toasts**: Múltiples notificaciones simultáneas

**Uso:**
```jsx
import { useToast } from '@/context/ToastContext';

const { showToast } = useToast();

// Ejemplos de uso:
showToast('Operación exitosa', 'success', '¡Éxito!');
showToast('Error al procesar', 'error', 'Error');
showToast('Información importante', 'info', 'Info');
showToast('Advertencia', 'warning', 'Atención');
```

### **4. Cómo usar los Contextos**

#### **En cualquier componente:**
```jsx
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const MiComponente = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada exitosamente', 'success');
  };

  return (
    <div>
      <p>Hola, {user.name}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};
```

### **5. Flujo de Autenticación**

```
1. Usuario visita /#/admin/usuarios
2. ProtectedRoute verifica isAuthenticated()
3. Si NO está autenticado → redirige a /login
4. Si SÍ está autenticado → renderiza AdminLayout + Users
5. AdminLayout usa AuthContext para mostrar info del usuario (Header, Sidebar)
6. Users puede usar useAuth() y useToast() para operaciones
7. Cualquier error HTTP 401 → Axios interceptor redirige a /login automáticamente
```

**Flujo de Login:**
```
1. Usuario accede a /#/login
2. PublicRoute verifica isAuthenticated()
3. Si YA está autenticado → redirige a /admin/home
4. Si NO está autenticado → muestra Login
5. Usuario ingresa credenciales
6. Login exitoso → AuthContext guarda token y user
7. Redirige automáticamente a /admin/home
```

### **5. Ventajas del Sistema de Contexto**

- **Estado centralizado**: No hay prop drilling
- **Fácil acceso**: Cualquier componente puede usar `useAuth()` o `useToast()`
- **Consistencia**: Mismo estado en toda la aplicación
- **Mantenibilidad**: Cambios en un lugar se reflejan en todos lados
- **Testing**: Fácil de mockear en tests

---

## 📱 Responsive Design

### **Breakpoints**
- **Desktop**: > 768px
- **Tablet**: 768px - 480px  
- **Móvil**: < 480px

### **Grid System**
- **CSS Grid** para layouts complejos
- **Flexbox** para alineaciones simples
- **Variables SCSS** para consistencia

---

## 🐛 Debugging

### **Herramientas**
- **React DevTools** - Inspeccionar componentes
- **Redux DevTools** - Estado de la aplicación
- **Console** - Logs y errores

### **Logs Comunes**
```javascript
console.log('Datos del formulario:', formData);
console.error('Error al enviar:', error);
```

---

## 📖 Recursos Adicionales

### **Documentación de Módulos**
- `/src/modules/admin/pages/user/README.md` - Módulo de usuarios
- `/src/modules/public/pages/suscription/README.md` - Módulo de suscripción

### **Patrones del Proyecto**
- **Arquitectura modular** por funcionalidad
- **Separación de responsabilidades** (UI, lógica, datos)
- **Reutilización de componentes** entre módulos
- **Consistencia en estilos** con variables SCSS


**¿Necesitas ayuda?** Revisa la documentación de módulos específicos o consulta con el equipo de desarrollo.

---

## 🚀 Cómo Empezar

### **1. Instalar dependencias**
```bash
npm install
```

### **2. Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
```

### **3. Ejecutar en desarrollo**
```bash
npm run dev
```

### **4. Acceder a la aplicación**
- **Login**: `http://localhost:5173/#/login`
- **Dashboard**: `http://localhost:5173/#/admin/home`

### **5. Compilar para producción**
```bash
npm run build
```

### **6. Preview de producción**
```bash
npm run preview
```

---

## 📚 Componentes y Herramientas Clave

### **Layout del Admin**
- **AdminLayout** - Layout principal con Header y Sidebar
- **Header** - Barra superior con información del usuario
- **Sidebar** - Menú lateral de navegación

### **Componentes de Formulario más usados**
- **InputField** - Campo de texto con label y validación
- **SelectField** - Selector con opciones
- **InfiniteSelect** - Selector con carga infinita (para listas grandes)
- **FileDropzone** - Subida de archivos con cropper de imágenes
- **DateField** - Selector de fechas
- **EditableTableField** - Tabla editable dentro de formularios

### **Componentes de Tabla**
- **PaginatedTable** - Tabla con paginación automática
  - Soporte para acciones (editar, eliminar, switch)
  - Ordenamiento de columnas
  - Estados de carga con skeleton
- **FilterBar** - Barra de filtros de búsqueda
- **ConfirmationModal** - Modal de confirmación de acciones

### **Navegación**
- **BreadCrumb** - Migas de pan con iconos

### **Hooks Personalizados**
- **usePaginatedFetch** - Hook para manejar datos paginados
  ```jsx
  const { data, pagination, loading, fetchPage, setLimit, forceRefetch } = usePaginatedFetch(
    async (page, limit) => {
      const response = await getUsers(page, limit);
      return {
        data: userAdapterList(response),
        pagination: response.data?.pagination
      };
    }
  );
  ```

---

## 🎯 Ejemplos Prácticos

### **1. Crear un nuevo módulo CRUD completo**

#### **Paso 1: Crear estructura de carpetas**
```
src/modules/admin/pages/miModulo/
├── components/
│   ├── MiModuloForm.jsx
│   └── miModuloForm.module.scss
├── adapters/
│   ├── miModulo.adapter.list.js
│   └── miModulo.adapter.get.js
├── constants/
│   └── miModuloConstants.js
├── MiModulos.jsx
├── NewMiModulo.jsx
├── EditMiModulo.jsx
└── miModulos.module.scss
```

#### **Paso 2: Crear servicio**
```javascript
// src/modules/admin/services/miModulo.service.js
import api from '@/services/interceptors/axiosConfig';

export const getMiModulos = async (page = 1, limit = 20) => {
  const response = await api.get(`/api/v1/mi-modulo?page=${page}&per_page=${limit}`);
  return response;
};

export const getMiModulo = async (id) => {
  const response = await api.get(`/api/v1/mi-modulo/${id}`);
  return response;
};

export const createMiModulo = async (data) => {
  const response = await api.post('/api/v1/mi-modulo', data);
  return response;
};

export const updateMiModulo = async (id, data) => {
  const response = await api.put(`/api/v1/mi-modulo/${id}`, data);
  return response;
};

export const deleteMiModulo = async (id) => {
  const response = await api.delete(`/api/v1/mi-modulo/${id}`);
  return response;
};
```

#### **Paso 3: Crear adaptadores**
```javascript
// adapters/miModulo.adapter.list.js
export const miModuloAdapterList = (data) => {
  return data.data?.data?.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    status: item.status === 'active' ? 'Activo' : 'Inactivo',
    is_active: item.status === 'active'
  }));
};

// adapters/miModulo.adapter.get.js
export const miModuloAdapterGet = (data) => {
  const item = data?.data?.data;
  return {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    status: item.status
  };
};
```

#### **Paso 4: Definir columnas de tabla**
```javascript
// constants/miModuloConstants.js
export const miModuloTableColumns = [
  { key: "nombre", label: "Nombre" },
  { key: "descripcion", label: "Descripción" },
  { key: "status", label: "Estado" },
];
```

#### **Paso 5: Crear página de listado**
```jsx
// MiModulos.jsx
import { useNavigate } from 'react-router-dom';
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable';
import { getMiModulos, deleteMiModulo } from '@/modules/admin/services/miModulo.service';
import { miModuloTableColumns } from './constants/miModuloConstants';
import { miModuloAdapterList } from './adapters/miModulo.adapter.list';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { MdModeEdit } from 'react-icons/md';

export const MiModulos = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data, pagination, loading, fetchPage, setLimit, forceRefetch } = usePaginatedFetch(
    async (page, limit) => {
      const response = await getMiModulos(page, limit);
      return {
        data: miModuloAdapterList(response),
        pagination: response.data?.pagination
      };
    }
  );

  const handleEdit = (item) => {
    navigate(`/admin/mi-modulo/${item.id}`);
  };

  const actions = [
    {
      icon: MdModeEdit,
      tooltip: 'Editar',
      onClick: handleEdit,
      className: 'action-button'
    }
  ];

  return (
    <div>
      <h2>Mi Módulo</h2>
      <div className="wrapperTableIndex">
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-mi-modulo')}>
          Nuevo
        </Button>
        <PaginatedTable
          dataToPresent={data}
          columns={miModuloTableColumns}
          pagination={pagination}
          onPageChange={fetchPage}
          onLimitChange={setLimit}
          actions={actions}
          loading={loading}
        />
      </div>
    </div>
  );
};
```

#### **Paso 6: Crear formulario reutilizable**
```jsx
// components/MiModuloForm.jsx
import { useState, useEffect } from 'react';
import { InputField } from '@/components/form/inputField/InputField';
import { Button } from '@/components/ui/button/Button';
import { createMiModulo, updateMiModulo } from '@/modules/admin/services/miModulo.service';
import { useToast } from '@/context/ToastContext';

export const MiModuloForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        id: initialData.id
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        await updateMiModulo(form.id, form);
      } else {
        await createMiModulo(form);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />
      <InputField
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        error={errors.descripcion}
      />
      <Button type="submit" variant="primary" isLoading={loading}>
        {form.id ? 'Guardar cambios' : 'Crear'}
      </Button>
    </form>
  );
};
```

#### **Paso 7: Crear páginas de creación y edición**
```jsx
// NewMiModulo.jsx
import { MiModuloForm } from './components/MiModuloForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';

export const NewMiModulo = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Creado exitosamente', 'success', '¡Éxito!');
    navigate('/admin/mi-modulo');
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Mi Módulo', to: '/admin/mi-modulo' },
        { label: 'Nuevo' }
      ]} />
      <h2>Nuevo Elemento</h2>
      <MiModuloForm onSuccess={handleSuccess} />
    </div>
  );
};

// EditMiModulo.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMiModulo } from '@/modules/admin/services/miModulo.service';
import { miModuloAdapterGet } from './adapters/miModulo.adapter.get';
import { MiModuloForm } from './components/MiModuloForm';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '@/components/form/FormSkeleton';

export const EditMiModulo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMiModulo(id);
        setItem(miModuloAdapterGet(response));
      } catch (error) {
        showToast('Error al cargar', 'error', 'Error');
        navigate('/admin/mi-modulo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSuccess = () => {
    showToast('Actualizado exitosamente', 'success', '¡Éxito!');
    navigate('/admin/mi-modulo');
  };

  return (
    <div>
      <h2>Editar Elemento</h2>
      {loading ? <FormSkeleton /> : <MiModuloForm initialData={item} onSuccess={handleSuccess} />}
    </div>
  );
};
```

#### **Paso 8: Agregar rutas en AdminRoutes.jsx**
```jsx
import { MiModulos } from "@/modules/admin/pages/miModulo/MiModulos";
import { NewMiModulo } from "@/modules/admin/pages/miModulo/NewMiModulo";
import { EditMiModulo } from "@/modules/admin/pages/miModulo/EditMiModulo";

// Dentro de las rutas protegidas:
<Route path="/mi-modulo" element={<MiModulos />} />
<Route path="/nuevo-mi-modulo" element={<NewMiModulo />} />
<Route path="/mi-modulo/:id" element={<EditMiModulo />} />
```

### **2. Ejemplo de manejo de errores global**
```jsx
// En cualquier componente
try {
  await updateMiModulo(id, data);
  showToast('Actualizado exitosamente', 'success', '¡Éxito!');
} catch (error) {
  // El error tiene la estructura del backend
  const message = error.response?.data?.message || 'Error al actualizar';
  const fieldErrors = error.response?.data?.errors || {};
  
  // Mostrar toast con error general
  showToast(message, 'error', 'Error');
  
  // Establecer errores de campos específicos
  setErrors(fieldErrors);
}
```

---

## 🎨 Buenas Prácticas

### **Nomenclatura**
- **Componentes**: PascalCase (`UserForm`, `PaginatedTable`)
- **Archivos de componentes**: PascalCase (`UserForm.jsx`)
- **Archivos de estilos**: camelCase (`userForm.module.scss`)
- **Variables y funciones**: camelCase (`handleSubmit`, `userData`)
- **Constantes**: UPPER_SNAKE_CASE o camelCase (`API_URL`, `userTableColumns`)
- **Carpetas**: camelCase (`userModule`, `dataDisplay`)

### **Estructura de Archivos**
- Un componente por archivo
- Estilos junto al componente
- Exportaciones nombradas preferidas sobre default
- Usar path alias `@/` para imports

### **Componentes**
- Usar PropTypes para validación de props
- Preferir componentes funcionales con hooks
- Extraer lógica compleja a hooks personalizados
- Mantener componentes pequeños y enfocados

### **Estado y Side Effects**
- Usar `useState` para estado local
- Usar `useContext` para estado global
- Usar `useEffect` para side effects
- Limpiar efectos cuando sea necesario

### **Estilos**
- Usar módulos SCSS para estilos específicos
- Usar variables SCSS del sistema de diseño
- Mantener estilos consistentes con el resto del proyecto
- Responsive design con mobile-first approach

### **API y Servicios**
- Centralizar llamadas a API en servicios
- Usar adaptadores para transformar datos
- Manejar errores de forma consistente
- Usar el interceptor de Axios para configuración global

### **Rendimiento**
- Usar `useMemo` para cálculos costosos
- Usar `useCallback` para funciones que se pasan como props
- Lazy loading de componentes pesados
- Optimizar imágenes y assets

---

## 📖 Recursos Adicionales

### **Documentación Interna**
- `/src/modules/admin/pages/user/README.md` - Módulo de usuarios (ejemplo completo)
- Cada módulo puede tener su propio README con detalles específicos

### **Librerías Principales**
- [React](https://react.dev/) - Documentación oficial
- [React Router](https://reactrouter.com/) - Sistema de rutas
- [PrimeReact](https://primereact.org/) - Componentes UI
- [Axios](https://axios-http.com/) - Cliente HTTP
- [Sass](https://sass-lang.com/) - Preprocesador CSS
- [Chart.js](https://www.chartjs.org/) - Gráficos
- [Leaflet](https://leafletjs.com/) - Mapas

### **Herramientas de Desarrollo**
- [Vite](https://vitejs.dev/) - Build tool
- [ESLint](https://eslint.org/) - Linter
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging

---

## 🐛 Solución de Problemas Comunes

### **Error: "useToast must be used within a ToastProvider"**
**Solución**: Asegúrate de que el componente esté dentro del árbol de componentes envuelto por `<ToastProvider>`. Verifica que `App.jsx` tenga el ToastProvider correctamente configurado.

### **Error: "isAuthenticated is not a function"**
**Solución**: Asegúrate de usar `useAuth()` dentro de un componente que esté envuelto por `<AuthProvider>`.

### **Las imágenes no cargan**
**Solución**: Verifica que estés importando las imágenes correctamente usando `import` o que las rutas sean correctas. Recuerda que Vite requiere imports explícitos.

### **Los estilos SCSS no se aplican**
**Solución**: 
1. Verifica que el archivo tenga extensión `.module.scss`
2. Importa como `import styles from './archivo.module.scss'`
3. Usa `className={styles.nombreClase}`

### **Errores 401 no autenticado**
**Solución**: El interceptor de Axios debería manejar esto automáticamente. Verifica que el token esté guardado correctamente en localStorage.

---

## 🚀 Roadmap y Mejoras Futuras

- [ ] Implementar tests unitarios (Jest + React Testing Library)
- [ ] Agregar tests E2E (Cypress o Playwright)
- [ ] Implementar i18n para multi-idioma
- [ ] Agregar modo oscuro/claro
- [ ] Optimizar bundle size con code splitting
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar analíticas y tracking
- [ ] Documentación con Storybook

---

## 👥 Contribución

### **Antes de contribuir:**
1. Revisa la documentación completa
2. Sigue los patrones establecidos en el proyecto
3. Usa las convenciones de nomenclatura
4. Escribe código limpio y documentado
5. Prueba tus cambios antes de hacer commit

### **Estructura de commits:**
```
tipo(módulo): descripción corta

Descripción detallada si es necesario

Ejemplos:
- feat(users): agregar filtro por email
- fix(auth): corregir redirección después de login
- style(catalog): actualizar colores del tema
- refactor(services): optimizar llamadas a API
- docs(readme): actualizar documentación de módulos
```

---

**CryptoChile Mining Store** - Sistema de administración de tienda de minería de criptomonedas

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025

---

¿Necesitas ayuda? Revisa la documentación de módulos específicos o consulta con el equipo de desarrollo.
