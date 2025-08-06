import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model('Conversation', messageSchema);
export default Conversation;
