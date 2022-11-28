// Modello di un oggetto "meteo"

const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    
    temperatura: {
        type: String,
        required: [true, 'temperature required']
    },
    data: {
        type: String,
    }
    
});

// Aggiunta del modello al DB
const Meteo = mongoose.model('meteo',MeteoSchema);

module.exports = Meteo;