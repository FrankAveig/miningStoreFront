# Módulo de Usuarios

Este módulo implementa la gestión completa de usuarios para la plataforma TYG Evaluación, siguiendo los patrones establecidos en el proyecto.

## Estructura

```
user/
├── adapters/
│   ├── user.adapter.list.js      # Adaptador para listado de usuarios
│   ├── user.adapter.get.js       # Adaptador para obtener usuario individual
│   └── roles.adapter.list.js     # Adaptador para listado de roles
├── components/
│   ├── UserForm.jsx              # Formulario de creación/edición de usuarios
│   └── userForm.module.scss      # Estilos del formulario
├── constants/
│   └── userConstants.js          # Constantes para la tabla de usuarios
├── EditUser.jsx                  # Página de edición de usuario
├── NewUser.jsx                   # Página de creación de usuario
├── Users.jsx                     # Página principal de listado de usuarios
├── users.module.scss             # Estilos de la página principal
└── README.md                     # Este archivo
```

## Funcionalidades

### Gestión de Usuarios
- **Listado paginado** de usuarios con filtros
- **Creación** de nuevos usuarios
- **Edición** de usuarios existentes
- **Activación/Desactivación** de usuarios
- **Gestión de roles** y permisos

### Formulario de Usuario
- **Campos requeridos**: Nombre, Email, Contraseña, Rol
- **Validación** en tiempo real
- **Selección de roles** con InfiniteSelect
- **Manejo de errores** del backend
- **Estados de carga** y feedback visual

### Tabla de Usuarios
- **Columnas**: Nombre, Email, Rol, Estado
- **Acciones**: Editar, Cambiar estado
- **Filtros**: Por nombre y email
- **Paginación** configurable
- **Modal de confirmación** para cambios de estado

## Componentes

### UserForm
Formulario reutilizable para crear y editar usuarios con validación completa y manejo de estados.

### Users
Página principal que muestra la tabla de usuarios con filtros, paginación y acciones.

### EditUser
Página específica para editar usuarios existentes con breadcrumbs y navegación.

### NewUser
Página para crear nuevos usuarios con breadcrumbs y navegación.

## Servicios

### users.service.js
- `getUsers(page, limit, name, email, isTrashed)` - Obtener listado paginado
- `getUser(id)` - Obtener usuario específico
- `createUser(data)` - Crear nuevo usuario
- `updateUser(id, data)` - Actualizar usuario existente
- `toggleUserStatus(id)` - Cambiar estado activo/inactivo
- `getRoles()` - Obtener listado de roles disponibles

## Adaptadores

### user.adapter.list.js
Transforma la respuesta del backend para el listado de usuarios:
```javascript
{
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.roles[0]?.detail,
  status: user.status,
  is_active: user.status
}
```

### user.adapter.get.js
Transforma la respuesta del backend para un usuario individual:
```javascript
{
  id: user.id,
  name: user.name,
  email: user.email,
  status: user.status,
  service_island_id: user.service_island_id,
  role: user.roles[0] || null
}
```

### roles.adapter.list.js
Transforma la respuesta del backend para los roles:
```javascript
{
  id: role.id,
  name: role.name,
  detail: role.detail,
  status: role.status
}
```

## Constantes

### userConstants.js
Define las columnas de la tabla de usuarios:
- **name**: Nombre del usuario
- **email**: Correo electrónico
- **role**: Rol asignado
- **status**: Estado activo/inactivo

## Estados del Usuario

- **Activo**: Usuario habilitado en el sistema
- **Inactivo**: Usuario deshabilitado temporalmente

## Validaciones

### Campos Requeridos
- **Nombre**: Texto no vacío
- **Email**: Formato válido de correo electrónico
- **Contraseña**: Mínimo 8 caracteres (solo para nuevos usuarios)
- **Rol**: Selección obligatoria de un rol del sistema

### Validaciones Específicas
- **Email único**: No se permiten emails duplicados
- **Contraseña**: Solo requerida para usuarios nuevos
- **Rol**: Debe ser un rol válido del sistema

## Navegación

### Breadcrumbs
- **Usuarios** → Lista principal
- **Nuevo usuario** → Formulario de creación
- **Editar usuario** → Formulario de edición

### Rutas
- `/admin/usuarios` - Lista de usuarios
- `/admin/nuevo-usuario` - Crear usuario
- `/admin/usuarios/:id` - Editar usuario

## Estilos

Los estilos utilizan las variables SCSS del proyecto y siguen el sistema de diseño establecido:
- **Colores primarios**: `#2B303F`, `#212533`, `#72bbff`
- **Espaciado consistente** con variables predefinidas
- **Diseño responsive** con breakpoints móviles
- **Transiciones suaves** y efectos hover

## Integración con Backend

### Endpoints Utilizados
- `GET /api/v1/user/admin/users` - Listado de usuarios
- `GET /api/v1/user/admin/users/:id` - Usuario específico
- `POST /api/v1/user/admin/users` - Crear usuario
- `PUT /api/v1/user/admin/users/:id` - Actualizar usuario
- `DELETE /api/v1/user/admin/users/:id` - Cambiar estado
- `GET /api/v1/user/admin/roles` - Listado de roles

### Manejo de Errores
- **Validación del backend**: Errores de campos específicos
- **Mensajes de error**: Traducción automática de respuestas
- **Toast notifications**: Feedback visual para el usuario
- **Fallbacks**: Manejo de errores inesperados

