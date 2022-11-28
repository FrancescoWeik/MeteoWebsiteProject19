// Modello di un oggetto "itinerary"


const mongoose = require('mongoose');
const MeteoComponent = require('./meteoComponent').schema;

const ItinerarySchema = mongoose.Schema({
    
    // Il campo name serve per dare un nome all'itinerario.
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    
    // Array che conterrà oggetti di tipo meteoComponent
    meteos_dates : {
        type : [MeteoComponent],
    }

});

// Aggiunta del modello al DB
const Itinerary = mongoose.model('itinerary',ItinerarySchema);

module.exports = Itinerary;