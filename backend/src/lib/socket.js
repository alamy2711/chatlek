/**
 * Security note: sending userId openly in the query is okay for demos,
 * but in production you should authenticate the socket
 * (e.g., send a JWT and verify it in a middleware)
 * so users can’t pretend to be someone else.
 */

/**
 * Duplicate connections: users opening multiple tabs will create multiple sockets.
 * You might want to map userId → Set<socketId> if you want to track multiple tabs per user.
 */

import { Server } from 'socket.io';
import { addUser, getOnlineUsers, removeUser } from '../sockets/userSocketMap.js';

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            // origin: process.env.CLIENT_URL || 'http://localhost:3001',
            origin: true,
            credentials: true,
        },
    });

    // TODO: JWT authentication for socket.io will be added later
    // io.use((socket, next) => {});

    io.on('connection', (socket) => {
        console.log(`A user connected with socket id: ${socket.id}`);

        const userId = socket.handshake.query.userId;
        if (!userId) {
            return socket.disconnect();
        }

        // Add the user to the map and emit online users
        addUser(userId, socket.id);
        io.emit('online-users', getOnlineUsers());

        // On disconnect, remove the user from the map and emit online users
        socket.on('disconnect', () => {
            console.log(`A user disconnected with socket id: ${socket.id}`);
            removeUser(userId);
            io.emit('online-users', getOnlineUsers());
        });
    });
};

export { initSocket, io };
