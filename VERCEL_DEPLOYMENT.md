# 🚀 Guía de Despliegue en Vercel - ChatWeb

## 📋 Pasos Detallados para Desplegar en Vercel

### **Paso 1: Preparar el Repositorio**
1. Asegúrate de que tu código esté subido a GitHub:
   ```bash
   git add .
   git commit -m "feat: preparar para despliegue en Vercel"
   git push origin main
   ```

### **Paso 2: Crear Cuenta en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Haz click en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tus repositorios

### **Paso 3: Importar Proyecto**
1. En el dashboard de Vercel, haz click en "New Project"
2. Busca tu repositorio "ChatWeb"
3. Haz click en "Import"

### **Paso 4: Configurar el Proyecto**
1. **Framework Preset**: Selecciona "Create React App"
2. **Root Directory**: Deja vacío (Vercel detectará automáticamente)
3. **Build and Output Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

### **Paso 5: Variables de Entorno**
En la sección "Environment Variables", agrega:

```
REACT_APP_API_URL = https://tu-backend.railway.app
REACT_APP_SOCKET_URL = https://tu-backend.railway.app
```

**⚠️ IMPORTANTE**: Reemplaza `tu-backend.railway.app` con la URL real de tu backend en Railway.

### **Paso 6: Desplegar**
1. Haz click en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu app estará disponible en una URL como `https://chat-web-xxx.vercel.app`!

## 🔧 Configuración del Backend (Railway)

### **Paso 1: Desplegar Backend en Railway**
1. Ve a [railway.app](https://railway.app)
2. Conecta tu GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio ChatWeb
5. Railway detectará automáticamente el backend

### **Paso 2: Variables de Entorno en Railway**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=tu_connection_string_mongodb_atlas
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-app.vercel.app
```

### **Paso 3: Actualizar URLs Cruzadas**
1. Una vez desplegado el backend, copia la URL de Railway
2. Ve a Vercel → Tu proyecto → Settings → Environment Variables
3. Actualiza `REACT_APP_API_URL` y `REACT_APP_SOCKET_URL` con la URL de Railway
4. Ve a Railway → Variables → Actualiza `FRONTEND_URL` con la URL de Vercel
5. Redespliega ambos servicios

## 📱 Verificación Final

### **Checklist de Funcionamiento:**
- [ ] Frontend carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Chat en tiempo real funciona
- [ ] Usuarios conectados se muestran
- [ ] Emojis funcionan
- [ ] Responsive en móvil

### **URLs Finales:**
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.railway.app`

## 🛠️ Solución de Problemas

### **Error: "Failed to build"**
- Verifica que el directorio `frontend/` existe
- Asegúrate de que `package.json` esté en `frontend/`

### **Error: "API calls failing"**
- Verifica que `REACT_APP_API_URL` esté correcta
- Confirma que el backend esté funcionando en Railway

### **Error: "WebSocket connection failed"**
- Verifica que `REACT_APP_SOCKET_URL` apunte al backend
- Confirma que Railway permita conexiones WebSocket

## 💰 Costos
- **Vercel**: Gratis para proyectos personales
- **Railway**: $5 crédito mensual gratis
- **MongoDB Atlas**: 512MB gratis

**Total: $0/mes** 🎉

¡Tu ChatWeb estará disponible 24/7 para que cualquier persona lo use desde cualquier dispositivo! 🌍
