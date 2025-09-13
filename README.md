# ChatWeb - Aplicación de Chat en Tiempo Real

Una aplicación de chat moderna construida con React, Node.js, Express, Socket.io y MongoDB. Incluye autenticación JWT, validaciones completas, modo oscuro por defecto y animaciones fluidas.

## 🚀 Características

- **Autenticación completa**: Login y registro con validaciones
- **Chat en tiempo real**: Mensajería instantánea con WebSockets
- **Validación de edad**: Solo usuarios mayores de 18 años
- **Modo oscuro**: Interfaz moderna con tema oscuro por defecto
- **Animaciones**: Transiciones suaves con Framer Motion
- **Usuarios online**: Lista de usuarios conectados en tiempo real
- **Indicador de escritura**: Muestra cuando alguien está escribiendo
- **Responsive**: Adaptable a dispositivos móviles

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB con Mongoose
- JWT para autenticación
- bcryptjs para encriptación
- express-validator para validaciones

### Frontend
- React 18 con TypeScript
- Socket.io-client
- React Router DOM
- Framer Motion para animaciones
- React Hook Form para formularios
- Axios para peticiones HTTP
- Lucide React para iconos
- React Hot Toast para notificaciones

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- MongoDB (local o remoto)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ChatWeb
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatweb
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Ejecución

### Iniciar MongoDB
Asegúrate de que MongoDB esté ejecutándose en tu sistema.

### Iniciar el Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en http://localhost:5000

### Iniciar el Frontend
```bash
cd frontend
npm start
```
La aplicación estará disponible en http://localhost:3000

## 📱 Uso de la Aplicación

### Registro
1. Ve a la página de registro
2. Completa todos los campos:
   - Nombre completo (solo letras y espacios)
   - Email válido
   - Fecha de nacimiento (debes ser mayor de 18 años)
   - Contraseña (mínimo 6 caracteres, debe incluir mayúscula, minúscula y número)
3. Confirma tu contraseña
4. Haz clic en "Crear Cuenta"

### Login
1. Ingresa tu email y contraseña
2. Haz clic en "Iniciar Sesión"

### Chat
1. Una vez autenticado, verás la pantalla principal del chat
2. En el sidebar izquierdo aparecen los usuarios conectados
3. Haz clic en un usuario para iniciar una conversación
4. Escribe tu mensaje y presiona Enter o haz clic en el botón de enviar
5. Verás indicadores cuando alguien esté escribiendo

### Características Adicionales
- **Cambiar tema**: Botón de sol/luna en el header del sidebar
- **Cerrar sesión**: Botón de logout en el header del sidebar
- **Responsive**: La aplicación se adapta a pantallas móviles

## 🔒 Seguridad

- Contraseñas encriptadas con bcryptjs
- Autenticación JWT con tokens seguros
- Validaciones tanto en frontend como backend
- Middleware de autenticación para rutas protegidas
- Validación de edad para registro

## 📁 Estructura del Proyecto

```
ChatWeb/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── chat.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   ├── SocketContext.tsx
    │   │   └── ThemeContext.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Chat.tsx
    │   ├── services/
    │   │   ├── authService.ts
    │   │   └── chatService.ts
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.tsx
    │   └── index.css
    ├── package.json
    └── tsconfig.json
```

## 🎨 Personalización

### Colores y Tema
Los colores se definen en variables CSS en `index.css`. Puedes modificar:
- `--bg-primary`: Color de fondo principal
- `--bg-secondary`: Color de fondo secundario
- `--accent-primary`: Color de acento principal
- Y más...

### Animaciones
Las animaciones están implementadas con Framer Motion. Puedes modificar las transiciones en cada componente.

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Revisa la URL de conexión en el archivo `.env`

### Error de CORS
- Asegúrate de que el frontend esté ejecutándose en el puerto 3000
- Verifica la configuración de CORS en `server.js`

### Problemas con WebSockets
- Verifica que ambos servidores estén ejecutándose
- Revisa la consola del navegador para errores de conexión

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout de usuario
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/users/online` - Obtener usuarios conectados
- `GET /api/users/all` - Obtener todos los usuarios
- `GET /api/users/profile` - Obtener perfil del usuario

### Chat
- `GET /api/chat/messages/:userId` - Obtener mensajes con un usuario
- `GET /api/chat/conversations` - Obtener conversaciones del usuario

### WebSocket Events
- `send_message` - Enviar mensaje
- `new_message` - Recibir mensaje
- `typing` - Indicador de escritura
- `users_online` - Lista de usuarios conectados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Creado con ❤️ para demostrar una aplicación de chat moderna y completa.

---

¡Disfruta chateando con ChatWeb! 🎉
