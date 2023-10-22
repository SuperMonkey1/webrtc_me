const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');  // Include cors package
const { SerialPort } = require('serialport')

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

// Create an UART port
const port = new SerialPort({
    path: 'COM8',
    baudRate: 9600,
  })


io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('throttle', (throttleValue) => {
        console.log('Throttle value received:', throttleValue);
    
        port.write(throttleValue + '\n', (err) => {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('Sent: ', throttleValue); // Log the sent message to the console
        });
        
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(8080, () => {console.log('Listening on port 8080');});
