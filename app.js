const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const constants = require('./config/constants');
const SocketService = require('./services/sockets');
const IceService = require('./services/ice');


class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocket();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use(express.json());
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/controller.html'));
        });

        this.app.get('/iceservers', async (req, res) => {
            try {
                const iceServers = await IceService.getIceServers();
                res.send(iceServers);
            } catch (error) {
                console.error('Error fetching ICE servers:', error);
                res.status(500).send('Error fetching ICE servers');
            }
        });
    }

    setupSocket() {
        this.io.on('connection', (socket) => {
            console.log('User connected');
            
            socket.on('offer', (offer) => {
                socket.broadcast.emit('offer', offer);
            });

            socket.on('initiate_connection', (offer) => {
                socket.broadcast.emit('initiate_connection', offer);
            });

            socket.on('disconnect_me', (offer) => {
                socket.broadcast.emit('disconnect_me', offer);
            });

            socket.on('answer', (answer) => {
                socket.broadcast.emit('answer', answer);
            });

            socket.on('candidate', (candidate) => {
                socket.broadcast.emit('candidate', candidate);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

    start() {
        const port = process.env.PORT || 3000;
        this.server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}

module.exports = { App };