import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import conversationRoutes from './routes/conversation.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';
import { initSocket } from './lib/socket.js';

// configure env
dotenv.config();

// initialize app and server
const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(
    cors({
        // origin: process.env.CLIENT_URL || 'http://localhost:3001',
        // allow all origins
        origin: true,
        credentials: true,
    })
);

// routes
app.get('/', (req, res) => {
    res.send('Hi from backend');
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);


// initialize socket.io
initSocket(server);

// start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
    connectDB();
});
