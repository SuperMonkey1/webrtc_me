const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const constants = require('./config/constants');
const SocketService = require('./services/service');

class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: { origin: "*", methods: ["GET", "POST"] }
        });
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocket();
    }

    setupMiddleware() {
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.json());
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/views/controller.html'));
        });

        this.app.get('/iceservers', async (req, res) => {
            // ICE servers implementation
        });
    }

    setupSocket() {
        new SocketService(this.io);
    }

    start() {
        this.server.listen(constants.PORT, () => {
            console.log(`Server running on port ${constants.PORT}`);
        });
    }
}