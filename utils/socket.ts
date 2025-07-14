import { io, Socket } from 'socket.io-client';
import { config } from './config';

// Socket.io event types
export interface NotificationEvent {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  content: string;
  userId: string;
  targetId: string;
  createdAt: string;
  read: boolean;
}

export interface MessageEvent {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export interface TypingEvent {
  userId: string;
  username: string;
  receiverId: string;
}

// Socket.io service class
class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private connectionTimeout: number = 10000; // 10 seconds

  // Initialize socket connection
  connect(userId: string, token: string) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return;
    }

    const SOCKET_URL = config.api.socketUrl;

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: this.connectionTimeout,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  // Setup socket event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, don't try to reconnect
        console.log('Server disconnected us, not attempting to reconnect');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached, giving up');
        this.isConnected = false;
      }
    });

    // Reconnection events
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
      this.isConnected = false;
    });

    // Authentication events
    this.socket.on('unauthorized', (error) => {
      console.error('❌ Socket authentication failed:', error);
      this.disconnect();
    });

    // Custom events
    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  }

  // Join user room
  joinUserRoom(userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join', userId);
      console.log('👤 Joined user room:', userId);
    } else {
      console.warn('⚠️ Cannot join user room: socket not connected');
    }
  }

  // Leave user room
  leaveUserRoom(userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave', userId);
      console.log('👤 Left user room:', userId);
    }
  }

  // Send typing status
  sendTypingStatus(data: TypingEvent) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', data);
    } else {
      console.warn('⚠️ Cannot send typing status: socket not connected');
    }
  }

  // Stop typing status
  sendStopTypingStatus(data: { userId: string; receiverId: string }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('stopTyping', data);
    } else {
      console.warn('⚠️ Cannot send stop typing status: socket not connected');
    }
  }

  // Send message
  sendMessage(messageData: {
    content: string;
    receiverId: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', messageData);
    } else {
      console.warn('⚠️ Cannot send message: socket not connected');
    }
  }

  // Listen for notifications
  onNotification(callback: (notification: NotificationEvent) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Listen for new messages
  onNewMessage(callback: (message: MessageEvent) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Listen for user typing
  onUserTyping(callback: (data: TypingEvent) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  // Listen for user stop typing
  onUserStopTyping(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('userStopTyping', callback);
    }
  }

  // Listen for post updates
  onPostUpdate(callback: (data: { postId: string; type: string }) => void) {
    if (this.socket) {
      this.socket.on('postUpdate', callback);
    }
  }

  // Listen for blog updates
  onBlogUpdate(callback: (data: { blogId: string; type: string }) => void) {
    if (this.socket) {
      this.socket.on('blogUpdate', callback);
    }
  }

  // Listen for question updates
  onQuestionUpdate(callback: (data: { questionId: string; type: string }) => void) {
    if (this.socket) {
      this.socket.on('questionUpdate', callback);
    }
  }

  // Remove event listeners
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Remove all event listeners
  offAll() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if socket is ready
  isReady(): boolean {
    return this.socket !== null && this.isConnected;
  }
}

// Create singleton instance
export const socketService = new SocketService();

// React hook for socket connection
export const useSocket = () => {
  return {
    connect: socketService.connect.bind(socketService),
    disconnect: socketService.disconnect.bind(socketService),
    joinUserRoom: socketService.joinUserRoom.bind(socketService),
    leaveUserRoom: socketService.leaveUserRoom.bind(socketService),
    sendTypingStatus: socketService.sendTypingStatus.bind(socketService),
    sendStopTypingStatus: socketService.sendStopTypingStatus.bind(socketService),
    sendMessage: socketService.sendMessage.bind(socketService),
    onNotification: socketService.onNotification.bind(socketService),
    onNewMessage: socketService.onNewMessage.bind(socketService),
    onUserTyping: socketService.onUserTyping.bind(socketService),
    onUserStopTyping: socketService.onUserStopTyping.bind(socketService),
    onPostUpdate: socketService.onPostUpdate.bind(socketService),
    onBlogUpdate: socketService.onBlogUpdate.bind(socketService),
    onQuestionUpdate: socketService.onQuestionUpdate.bind(socketService),
    off: socketService.off.bind(socketService),
    offAll: socketService.offAll.bind(socketService),
    getConnectionStatus: socketService.getConnectionStatus.bind(socketService),
    getSocket: socketService.getSocket.bind(socketService),
    isReady: socketService.isReady.bind(socketService),
  };
}; 