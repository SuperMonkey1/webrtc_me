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

        // Check if the received command is "motordata"
        if (command === 'motordata') {
            console.log('motor commands received');
        }


        // if (command === 'start') {
        //     motor.writeSync(1);
        // } else if (command === 'stop') {
        //     motor.writeSync(0);
        // }
    });

    socket.on('throttle', (throttleValue) => {
        console.log('Throttle value received:', throttleValue);
        // You can add more code here to handle the throttle value, e.g., control a motor
    });

    socket.on('motor-command', (command) => {
        console.log('Motor command:', command);

        // Check if the received command is "motordata"
        if (command === 'motordata') {
            console.log('motor commands received');
        }
        
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
