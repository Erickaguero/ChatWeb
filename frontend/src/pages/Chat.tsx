import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Send, Users, LogOut, Sun, Moon } from 'lucide-react';
import EmojiPicker from '../components/EmojiPicker';
import { chatService } from '../services/chatService';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  messageType: string;
  createdAt: string;
  isRead: boolean;
}

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const { onlineUsers, sendMessage, isTyping, typingUser, setTyping, unreadMessages, markMessagesAsRead, messages: socketMessages } = useSocket();
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (userId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await chatService.getMessages(userId);
      setMessages(response.messages || []);
    } catch (error: any) {
      toast.error(error.message || 'Error cargando mensajes');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleUserSelect = (selectedUser: any) => {
    setSelectedUser(selectedUser);
    loadMessages(selectedUser._id);
    // Marcar mensajes como leídos cuando se selecciona un usuario
    markMessagesAsRead(selectedUser._id);
  };

  // Efecto para actualizar mensajes en tiempo real
  useEffect(() => {
    if (selectedUser && socketMessages.length > 0) {
      // Filtrar mensajes relevantes para la conversación actual
      const relevantMessages = socketMessages.filter(msg => 
        (msg.sender._id === selectedUser._id && msg.receiver._id === user?._id) ||
        (msg.sender._id === user?._id && msg.receiver._id === selectedUser._id)
      );
      
      if (relevantMessages.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const newMessages = relevantMessages.filter(m => !existingIds.has(m._id));
          return [...prev, ...newMessages];
        });
      }
    }
  }, [socketMessages, selectedUser, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && selectedUser) {
      sendMessage(selectedUser._id, messageInput);
      setMessageInput('');
      
      // Limpiar indicador de escritura
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTyping(selectedUser._id, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (selectedUser) {
      // Enviar indicador de escritura
      setTyping(selectedUser._id, true);
      
      // Limpiar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Parar indicador de escritura después de 2 segundos
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(selectedUser._id, false);
      }, 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      toast.error('Error cerrando sesión');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <motion.div 
        className="sidebar"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user && getInitials(user.name)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                En línea
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="users-list">
          <div className="users-title">
            <Users size={16} style={{ marginRight: '8px' }} />
            Usuarios Conectados ({onlineUsers.length})
          </div>
          <AnimatePresence>
            {onlineUsers.map((onlineUser: any, index: number) => (
              <motion.div
                key={onlineUser._id}
                className={`user-item ${selectedUser?._id === onlineUser._id ? 'active' : ''} ${unreadMessages[onlineUser._id] > 0 ? 'has-unread' : ''}`}
                onClick={() => handleUserSelect(onlineUser)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="user-avatar">
                  {getInitials(onlineUser.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{onlineUser.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {onlineUser.email}
                  </div>
                </div>
                {unreadMessages[onlineUser._id] > 0 && (
                  <div className="unread-badge">
                    {unreadMessages[onlineUser._id]}
                  </div>
                )}
                <div className="user-status"></div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {onlineUsers.length === 0 && (
            <motion.div 
              style={{ 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                padding: '20px',
                fontStyle: 'italic'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No hay usuarios conectados
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Chat principal */}
      <motion.div 
        className="main-chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {selectedUser ? (
          <>
            {/* Header del chat */}
            <motion.div 
              className="chat-header"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="user-info">
                <div className="user-avatar">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{selectedUser.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {onlineUsers.find(u => u._id === selectedUser._id) ? 'En línea' : 'Desconectado'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mensajes */}
            <div className="chat-messages">
              {isLoadingMessages ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Cargando mensajes...
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message._id}
                      className={`message ${message.sender._id === user?._id ? 'own' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.sender._id !== user?._id && (
                        <div className="user-avatar">
                          {getInitials(message.sender.name)}
                        </div>
                      )}
                      <div className="message-content">
                        <div>{message.content}</div>
                        <div className="message-time">
                          {formatMessageTime(message.createdAt)}
                        </div>
                      </div>
                      {message.sender._id === user?._id && (
                        <div className="user-avatar">
                          {getInitials(message.sender.name)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {isTyping && typingUser && (
                <motion.div 
                  className="typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {typingUser} está escribiendo...
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <motion.div 
              className="chat-input-container"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder={`Escribe un mensaje a ${selectedUser.name}...`}
                  className="chat-input"
                />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                <motion.button
                  type="submit"
                  className="send-button"
                  disabled={!messageInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                </motion.button>
              </form>
            </motion.div>
          </>
        ) : (
          <motion.div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Users size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h2>Selecciona un usuario para empezar a chatear</h2>
            <p>Elige a alguien de la lista de usuarios conectados</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
