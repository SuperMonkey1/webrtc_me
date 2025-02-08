const { SerialPort } = require('serialport');
const constants = require('../config/constants');

class SerialService {
    constructor() {
        this.port = new SerialPort({
            path: constants.SERIAL_PORT,
            baudRate: constants.SERIAL_BAUD_RATE
        });
    }

    sendCommand(type, value) {
        return new Promise((resolve, reject) => {
            this.port.write(`${type}:${value}\n`, (err) => {
                if (err) {
                    console.error(`Error sending ${type}:`, err);
                    reject(err);
                }
                console.log(`${type} sent:`, value);
                resolve();
            });
        });
    }
}
