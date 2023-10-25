const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');  // Include cors package
const { SerialPort } = require('serialport')

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

    socket.on('control_data', (data) => {
        console.log('Control data received:', data);

        let throttleValue = data.throttle;
        let steeringValue = data.steering;
        
        console.log('Throttle value:', throttleValue);
        console.log('Steering value:', steeringValue);

        // Sending throttle value
        port.write(`throttle:${throttleValue}\n`, (err) => {
            if (err) {
                return console.log('Error on throttle write: ', err.message);
            }
            console.log('Throttle Sent: ', throttleValue); // Log the sent message to the console
        });

        // Sending steering value
        port.write(`steering:${steeringValue}\n`, (err) => {
            if (err) {
                return console.log('Error on steering write: ', err.message);
            }
            console.log('Steering Sent: ', steeringValue); // Log the sent message to the console
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(8080, () => {console.log('Listening on port 8080');});

//Hallo
