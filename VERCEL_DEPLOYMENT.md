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
1. **Framework Preset**: Selecciona "Other" (ya que tenemos configuración personalizada)
2. **Root Directory**: Deja vacío (Vercel detectará automáticamente)
3. **Build and Output Settings**:
   - Build Command: `cd frontend && CI=false npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install --legacy-peer-deps`

### **Paso 5: Variables de Entorno**
En la sección "Environment Variables", agrega:

```
NODE_ENV = production
MONGODB_URI = tu_connection_string_mongodb_atlas
JWT_SECRET = tu_secreto_super_seguro_aqui
FRONTEND_URL = https://tu-app.vercel.app
```

**⚠️ IMPORTANTE**: 
- Reemplaza `tu_connection_string_mongodb_atlas` con tu string de conexión de MongoDB Atlas
- Reemplaza `tu_secreto_super_seguro_aqui` con un secreto JWT seguro
- La URL del frontend se actualizará automáticamente después del primer despliegue

### **Paso 6: Desplegar**
1. Haz click en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu app estará disponible en una URL como `https://chat-web-xxx.vercel.app`!

## 🔧 Configuración del Backend (Incluido en Vercel)

### **Backend Desplegado Automáticamente**
Con la nueva configuración, tanto el frontend como el backend se despliegan en Vercel:
- **Frontend**: Se sirve como sitio estático
- **Backend**: Se ejecuta como función serverless en `/api/*`

### **Variables de Entorno Necesarias**
Asegúrate de configurar estas variables en Vercel:
```
NODE_ENV=production
MONGODB_URI=tu_connection_string_mongodb_atlas
JWT_SECRET=tu_secreto_super_seguro_aqui
FRONTEND_URL=https://tu-app.vercel.app
```

### **Configuración de MongoDB Atlas**
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea un cluster gratuito
3. Obtén tu connection string
4. Agrega la IP de Vercel a la whitelist (0.0.0.0/0 para desarrollo)

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
- **Backend API**: `https://tu-app.vercel.app/api/*`

## 🛠️ Solución de Problemas

### **Error: "Failed to build"**
- Verifica que el directorio `frontend/` existe
- Asegúrate de que `package.json` esté en `frontend/`

### **Error: "API calls failing"**
- Verifica que las variables de entorno estén configuradas en Vercel
- Confirma que MongoDB Atlas esté accesible desde Vercel

### **Error: "WebSocket connection failed"**
- Verifica que `FRONTEND_URL` esté configurada correctamente
- Confirma que las rutas de API estén funcionando en `/api/*`

## 💰 Costos
- **Vercel**: Gratis para proyectos personales (incluye frontend + backend)
- **MongoDB Atlas**: 512MB gratis

**Total: $0/mes** 🎉

¡Tu ChatWeb estará disponible 24/7 para que cualquier persona lo use desde cualquier dispositivo! 🌍
