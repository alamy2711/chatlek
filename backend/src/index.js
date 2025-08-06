import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import conversationRoutes from './routes/conversation.route.js';
import messageRoutes from './routes/message.route.js';

// configure env
dotenv.config();

// initialize app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
    connectDB();
});
