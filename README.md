# TYG Evaluación - Frontend
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
├── admin/              # Panel de administración
│   ├── pages/         # Páginas del admin
│   ├── layout/        # Layout del admin
│   └── services/      # Servicios del admin
└── public/             # Páginas públicas
    └── pages/         # Páginas accesibles sin login
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
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/login/*" element={<AdminRoutes />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  )
}
```

**Puntos clave:**
- **HashRouter**: Usa `#` en las URLs (ej: `/#/admin/usuarios`)
- **Rutas anidadas**: `/*` permite que cada grupo maneje sus propias subrutas
- **Separación clara**: Públicas, Admin y Login están completamente separadas

### **2. Rutas Públicas** (`/src/routes/PublicRoutes.jsx`)
```jsx
export const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<SuscriptionPage />} />
      <Route path="/" element={<SuscriptionPage />} />
      <Route path="/suscripcion" element={<SuscriptionPage />} />
    </Routes>
  );
};
```

**Características:**
- **Acceso libre**: Sin autenticación requerida
- **Rutas simples**: Solo páginas de información y suscripción
- **Sin layout**: Cada página maneja su propio diseño

### **3. Rutas de Admin** (`/src/routes/AdminRoutes.jsx`)
```jsx
export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas del admin */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Rutas protegidas */}
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/nuevo-usuario" element={<NewUser />} />
        <Route path="/usuarios/:id" element={<EditUser />} />
      </Route>
    </Routes>
  )
}
```

**Sistema de Protección:**
- **ProtectedRoute**: Verifica autenticación antes de renderizar
- **PublicRoute**: Redirige usuarios autenticados al admin
- **AdminLayout**: Layout común para todas las páginas protegidas

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
$primary-color: #2B303F;      // Azul oscuro
$secondary-color: #72bbff;    // Azul claro
$background-color: #212533;   // Fondo oscuro
$accent-color: #F26007;       // Naranja

// Espaciado
$spacing-xs: 0.3125rem;      // 5px
$spacing-s: 0.625rem;        // 10px
$spacing-m: 1.25rem;         // 20px
$spacing-l: 2.5rem;          // 40px
$spacing-xl: 3.75rem;        // 60px
```

### **Componentes UI** (`/src/components/ui/`)
- **Button** - Botones con variantes
- **Input** - Campos de texto
- **Select** - Selectores desplegables
- **Switch** - Interruptores
- **Toast** - Notificaciones

---

## 🔧 Patrones de Desarrollo

### **1. Estructura de Módulos**
Cada módulo sigue esta estructura:
```
modulo/
├── components/         # Componentes específicos
├── adapters/          # Transformadores de datos
├── constants/         # Constantes del módulo
├── services/          # Llamadas a APIs
└── README.md          # Documentación del módulo
```

### **2. Adaptadores**
Transforman respuestas del backend:
```javascript
// Ejemplo: user.adapter.list.js
export const userAdapterList = (data) => {
  return data.data?.data?.data?.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.roles[0]?.detail,
    status: user.status
  }));
};
```

### **3. Servicios**
Manejan las llamadas a APIs:
```javascript
// Ejemplo: users.service.js
export const getUsers = async (page, limit, name, email) => {
  const response = await api.get(`/api/v1/user/admin/users?page=${page}&per_page=${limit}&name=${name}&email=${email}`);
  return response;
};
```

---

## 🔐 Sistema de Contexto


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

### **2. ToastContext** (`/src/context/ToastContext.jsx`)
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
- **Notificaciones**: `showToast(message, type, title)`
- **Tipos**: `info`, `success`, `error`, `warning`
- **Auto-eliminación**: Desaparecen después de 5 segundos
- **Cola de toasts**: Múltiples notificaciones simultáneas

### **3. Cómo usar los Contextos**

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

### **4. Flujo de Autenticación**

```
1. Usuario visita /admin/usuarios
2. ProtectedRoute verifica isAuthenticated()
3. Si NO está autenticado → redirige a /login
4. Si SÍ está autenticado → renderiza AdminLayout + Users
5. AdminLayout usa AuthContext para mostrar info del usuario
6. Users puede usar useAuth() para operaciones que requieren permisos
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

### **2. Ejecutar en desarrollo**
```bash
npm run dev
```

### **3. Acceder a la aplicación**
- **Público**: `http://localhost:5173/`
- **Admin**: `http://localhost:5173/#/admin/home`

---

## 📚 Componentes Importantes

### **Formularios**
- **InputField** - Campo de texto con validación
- **SelectField** - Selector con opciones
- **FileDropzone** - Subida de archivos con cropper

### **Tablas**
- **PaginatedTable** - Tabla con paginación
- **FilterBar** - Filtros de búsqueda
- **ConfirmationModal** - Modal de confirmación

### **Navegación**
- **BreadCrumb** - Migas de pan
- **AdminLayout** - Layout principal del admin

---

## 🎯 Ejemplos Prácticos

### **Crear una nueva ruta protegida:**
```jsx
// En AdminRoutes.jsx
<Route path="/nueva-funcionalidad" element={<NuevaFuncionalidad />} />

// En NuevaFuncionalidad.jsx
export const NuevaFuncionalidad = () => {
  const { user } = useAuth(); // ✅ Acceso al usuario
  const { showToast } = useToast(); // ✅ Acceso a notificaciones
  
  return <div>Nueva funcionalidad para {user.name}</div>;
};
```

### **Proteger una ruta personalizada:**
```jsx
const MiRutaProtegida = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/admin/home" replace />;
  }
  
  return children;
};

// Uso
<MiRutaProtegida requiredRole="admin">
  <PanelAdmin />
</MiRutaProtegida>
```

---

**¿Necesitas ayuda?** Revisa la documentación de módulos específicos o consulta con el equipo de desarrollo.
# miningStoreFront
