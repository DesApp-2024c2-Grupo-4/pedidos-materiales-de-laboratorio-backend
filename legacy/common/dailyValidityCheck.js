const cron = require('node-cron');
const updateValidity = require('./updateValidity'); // importa tu función

// Ejecuta la función todos los días a la medianoche
const dailyUpdate = cron.schedule('0 0 * * *', () => {
    updateValidity();
});

module.exports = dailyUpdate;
