const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

// Almacenar conexiones activas
const connectedUsers = new Map();

const socketHandler = (io) => {
  // Middleware de autenticación para sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Invalid token'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ Usuario conectado: ${socket.user.name} (${socket.userId})`);

    // Agregar usuario a la lista de conectados
    const publicUser = socket.user.toPublicJSON();
    publicUser.isOnline = true; // Asegurar que esté marcado como online
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: publicUser
    });

    // Actualizar estado online del usuario
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Unirse a una sala personal
    socket.join(socket.userId);

    // Emitir lista de usuarios conectados a todos (excluyendo al usuario actual de su propia lista)
    const onlineUsers = Array.from(connectedUsers.values()).map(conn => conn.user);
    // Emitir a cada usuario su lista personalizada (sin incluirse a sí mismo)
    connectedUsers.forEach((connectedUser, userId) => {
      console.log(`🔍 Filtrando para usuario ${userId}`);
      console.log(`📋 Usuarios online:`, onlineUsers.map(u => ({ id: u._id, name: u.name })));
      const filteredUsers = onlineUsers.filter(user => {
        const userIdStr = user._id.toString();
        const match = userIdStr !== userId;
        console.log(`👤 Usuario ${user.name}: ${userIdStr} !== ${userId} = ${match}`);
        return match;
      });
      console.log(`✅ Enviando ${filteredUsers.length} usuarios filtrados a ${userId}`);
      io.to(userId).emit('users_online', filteredUsers);
    });

    // Manejar envío de mensajes
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text' } = data;

        // Validar datos
        if (!receiverId || !content) {
          socket.emit('error', { message: 'Datos de mensaje inválidos' });
          return;
        }

        // Verificar que el receptor existe
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit('error', { message: 'Usuario receptor no encontrado' });
          return;
        }

        // Crear nuevo mensaje
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content,
          messageType
        });

        await message.save();

        // Poblar los datos del mensaje
        await message.populate('sender', 'name avatar');
        await message.populate('receiver', 'name avatar');

        // Emitir mensaje al receptor si está conectado
        io.to(receiverId).emit('new_message', {
          _id: message._id,
          sender: message.sender,
          receiver: message.receiver,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt,
          isRead: message.isRead
        });

        // Confirmar al emisor
        socket.emit('message_sent', {
          _id: message._id,
          sender: message.sender,
          receiver: message.receiver,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt,
          isRead: message.isRead
        });

      } catch (error) {
        console.error('Error enviando mensaje:', error);
        socket.emit('error', { message: 'Error enviando mensaje' });
      }
    });

    // Manejar indicador de escritura
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      io.to(receiverId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping
      });
    });

    // Manejar desconexión
    socket.on('disconnect', async () => {
      console.log(`❌ Usuario desconectado: ${socket.user.name} (${socket.userId})`);

      // Remover de usuarios conectados
      connectedUsers.delete(socket.userId);

      // Actualizar estado offline
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Emitir lista actualizada de usuarios conectados (excluyendo al usuario actual de su propia lista)
      const onlineUsers = Array.from(connectedUsers.values()).map(conn => conn.user);
      // Emitir a cada usuario su lista personalizada (sin incluirse a sí mismo)
      connectedUsers.forEach((connectedUser, userId) => {
        const filteredUsers = onlineUsers.filter(user => user._id.toString() !== userId);
        io.to(userId).emit('users_online', filteredUsers);
      });
    });

    // Manejar marcado de mensajes como leídos
    socket.on('mark_messages_read', async (data) => {
      try {
        const { senderId } = data;
        
        await Message.updateMany(
          { sender: senderId, receiver: socket.userId, isRead: false },
          { isRead: true, readAt: new Date() }
        );

        // Notificar al emisor que sus mensajes fueron leídos
        io.to(senderId).emit('messages_read', {
          readBy: socket.userId,
          readAt: new Date()
        });

      } catch (error) {
        console.error('Error marcando mensajes como leídos:', error);
      }
    });
  });
};

module.exports = socketHandler;
