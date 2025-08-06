import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';

export const startConversation = async (req, res) => {
    try {
        const authUser = req.user;
        const { receiverId } = req.body;

        // Check if the receiver user exists in the database
        const receiverUser = await User.findById(receiverId);
        if (!receiverUser) {
            return res.status(404).json({ success: false, message: 'Receiver user not found' });
        }

        // Check if conversation already exists between the two users
        const existingConversation = await Conversation.findOne({
            participants: { $all: [authUser._id, receiverId] },
        });
        if (existingConversation) {
            return res.status(200).json({ success: true, message: 'Conversation already exists', conversation: existingConversation });
        }

        // Create a new conversation
        const newConversation = new Conversation({
            participants: [authUser._id, receiverId],
        });
        await newConversation.save();

        res.status(201).json({
            success: true,
            message: 'Conversation started successfully',
            conversation: newConversation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
