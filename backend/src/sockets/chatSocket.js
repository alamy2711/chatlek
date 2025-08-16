export default  chatSocket = (socket, io) => {
    



    socket.on('disconnect', () => {
        console.log(`A user disconnected with socket id: ${socket.id}`);
    });
    
};