const constants = {
    PORT: process.env.PORT || 3000,
    SERIAL_PORT: 'COM8',
    SERIAL_BAUD_RATE: 9600,
    XIRSYS_CONFIG: {
        host: "global.xirsys.net",
        path: "/_turn/freleys",
        auth: "freleys:95a5e7a4-2cd5-11ee-bd9a-0242ac130003"
    }
};

module.exports = constants;