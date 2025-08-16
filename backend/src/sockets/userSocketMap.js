export const userSocketMap = new Map(); // userId → socketId

export function addUser(userId, socketId) {
    //save id as string format
    userId = userId.toString();

    userSocketMap.set(userId, socketId);
}

export function removeUser(userId) {
    userSocketMap.delete(userId);
}

export function getReceiverSocketId(userId) {
    return userSocketMap.get(userId);
}

export function getOnlineUsers() {
    return Array.from(userSocketMap.keys());
}

