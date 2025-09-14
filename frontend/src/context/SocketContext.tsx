import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

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

interface OnlineUser {
  _id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  avatar: string;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => void;
  isTyping: boolean;
  typingUser: string | null;
  setTyping: (receiverId: string, isTyping: boolean) => void;
  unreadMessages: { [userId: string]: number };
  markMessagesAsRead: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [userId: string]: number }>({});

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: token
        }
      });

      setSocket(newSocket);

      // Escuchar usuarios online
      newSocket.on('users_online', (users: OnlineUser[]) => {
        setOnlineUsers(users);
      });

      // Escuchar nuevos mensajes
      newSocket.on('new_message', (message: Message) => {
        setMessages((prev: Message[]) => [...prev, message]);
        // Incrementar contador de mensajes no leídos
        setUnreadMessages((prev: { [userId: string]: number }) => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1
        }));
      });

      // Confirmar mensaje enviado
      newSocket.on('message_sent', (message: Message) => {
        setMessages((prev: Message[]) => [...prev, message]);
      });

      // Escuchar indicador de escritura
      newSocket.on('user_typing', ({ userId, userName, isTyping: typing }) => {
        if (typing) {
          setIsTyping(true);
          setTypingUser(userName);
        } else {
          setIsTyping(false);
          setTypingUser(null);
        }
      });

      // Manejar errores
      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const sendMessage = (receiverId: string, content: string) => {
    if (socket && content.trim()) {
      socket.emit('send_message', {
        receiverId,
        content: content.trim(),
        messageType: 'text'
      });
    }
  };

  const setTyping = (receiverId: string, typing: boolean) => {
    if (socket) {
      socket.emit('typing', {
        receiverId,
        isTyping: typing
      });
    }
  };

  const markMessagesAsRead = (userId: string) => {
    setUnreadMessages((prev: { [userId: string]: number }) => ({
      ...prev,
      [userId]: 0
    }));
  };

  const value = {
    socket,
    onlineUsers,
    messages,
    sendMessage,
    isTyping,
    typingUser,
    setTyping,
    unreadMessages,
    markMessagesAsRead
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
