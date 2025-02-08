class SocketService {
    constructor(io) {
        this.io = io;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('User connected');
            
            this.handleWebRTCEvents(socket);
            this.handleControlEvents(socket);
            
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

    handleWebRTCEvents(socket) {
        const events = ['offer', 'answer', 'candidate', 'initiate_connection', 'disconnect_me'];
        events.forEach(event => {
            socket.on(event, (data) => {
                socket.broadcast.emit(event, data);
            });
        });
    }

    handleControlEvents(socket) {
        socket.on('control_data', (data) => {
            // Emit to robot or handle control logic
        });
    }
}