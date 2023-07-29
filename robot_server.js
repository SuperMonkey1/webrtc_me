const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');  // Include cors package

// const Gpio = require('onoff').Gpio;
// const motor = new Gpio(4, 'out');

const app = express();
app.use(cors());  // Use cors middleware

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('motor-command', (command) => {
        console.log('Motor command:', command);

        // if (command === 'start') {
        //     motor.writeSync(1);
        // } else if (command === 'stop') {
        //     motor.writeSync(0);
        // }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(8080, () => {console.log('Listening on port 8080');});
