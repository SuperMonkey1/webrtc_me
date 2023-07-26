// Import the necessary libraries
const express = require('express');
const onoff = require('onoff');

const Gpio = onoff.Gpio;
const led = new Gpio(4, 'out'); // Set GPIO 4 to output

// Create an Express application
const app = express();

// Handle POST request to /led
app.post('/led', function(req, res) {
    let value = req.body.value;
    led.writeSync(value); // Turn LED on or off depending on the value
    res.sendStatus(200);
});

// Start the server
app.listen(3000, function() {
    console.log('Listening on port 3000');
});
