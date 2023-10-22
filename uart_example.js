const { SerialPort } = require('serialport')

// Create a port
const port = new SerialPort({
  path: 'COM8',
  baudRate: 9600,
})

let state = false; // Boolean to track the state (on/off)

function toggleState() {
    state = !state; // Toggle the state

    const message = state ? 'on' : 'off'; // Determine the message based on the state

    // Send the message over the serial port
    port.write(message + '\n', (err) => {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Sent: ', message); // Log the sent message to the console
    });
}

// Call toggleState function every 1000 milliseconds (1 second)
setInterval(toggleState, 1000);