import Chat from '../models/Chat.js';

export const getChatsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      $or: [{ driver: userId }, { sender: userId }]
    })
    .populate('driver', 'firstName lastName')
    .populate('sender', 'firstName lastName')
    .populate('announcement', 'startLocation endLocation')
    .sort({ lastMessage: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'firstName lastName');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of the chat
    if (chat.driver.toString() !== req.user.id && chat.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark messages as read for the current user
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user.id) {
        message.read = true;
      }
    });

    await chat.save();
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};