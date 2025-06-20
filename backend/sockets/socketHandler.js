import Chat from '../models/Chat.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const setupSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.firstName} connected`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Join chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content, announcementId, receiverId } = data;
        
        let chat = await Chat.findById(chatId);
        
        // Create new chat if it doesn't exist
        if (!chat && announcementId && receiverId) {
          chat = new Chat({
            announcement: announcementId,
            driver: socket.user.role === 'driver' ? socket.userId : receiverId,
            sender: socket.user.role === 'sender' ? socket.userId : receiverId,
            messages: []
          });
        }

        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Add message to chat
        const message = {
          sender: socket.userId,
          content,
          timestamp: new Date(),
          read: false
        };

        chat.messages.push(message);
        chat.lastMessage = new Date();
        await chat.save();

        // Populate sender info for the response
        await chat.populate('messages.sender', 'firstName lastName');
        const populatedMessage = chat.messages[chat.messages.length - 1];

        // Emit to chat room
        io.to(chatId).emit('new-message', {
          chatId: chat._id,
          message: populatedMessage
        });

        // Send notification to specific user if they're not in the chat room
        const otherUserId = socket.user.role === 'driver' ? chat.sender : chat.driver;
        io.to(otherUserId.toString()).emit('chat-notification', {
          chatId: chat._id,
          message: populatedMessage,
          from: socket.user.firstName + ' ' + socket.user.lastName
        });

      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.firstName} disconnected`);
    });
  });
};