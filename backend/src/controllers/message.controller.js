import cloudinary from '../lib/cloudinary.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import {io} from '../lib/socket.js';
import { getReceiverSocketId, userSocketMap } from '../sockets/userSocketMap.js';


export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Find the conversation by ID
        const conversation = await Conversation.findById(conversationId);

        // Check if the conversation exists
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        // Get messages associated with the conversation
        const messages = await Message.find({ conversation: conversationId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: 'Messages fetched successfully',
            messages: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const authUser = req.user;
        const { conversationId } = req.params;
        const { content, media } = req.body;

        // Find the conversation by ID
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Check if the user is a participant in the conversation
        if (!conversation.participants.includes(authUser._id)) {
            return res.status(403).json({ success: false, message: 'You are not a participant in this conversation' });
        }

        // Validate content
        if (!content && !media) {
            return res.status(400).json({ success: false, message: 'Content or media is required' });
        }

        // If media is provided, upload it to Cloudinary
        let mediaUrl = null;
        if (media) {
            const uploadResponse = await cloudinary.uploader.upload(media);
            mediaUrl = uploadResponse.secure_url;
        }

        // Create a new message
        const newMessage = new Message({
            conversation: conversationId,
            sender: authUser._id,
            content,
            media: mediaUrl,
        });

        await newMessage.save();

        // Update the conversation's last message and timestamp
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        // Real-time functionality using Socket.IO
        const receiverId = conversation.participants.find((participant) => participant.toString() !== authUser._id.toString()).toString();
        const receiverSocketId = getReceiverSocketId(receiverId);
        io.to(receiverSocketId).emit('new-message', newMessage);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            message: newMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
