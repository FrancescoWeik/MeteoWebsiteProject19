// Modello di un oggetto "user"

const mongoose = require('mongoose');
const Itinerary = require('./itinerary').schema;

const UserSchema = mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email field is required']
    },

    password: {
        type: String,
        required: [true, 'Password field is required']
    },

    /* Il campo "itinerary" serve per collegare itinerari all'utente.
    E' un array di ID itineraries. */
    itinerary : {
        type : [Itinerary],
    }
    
});

const User = mongoose.model('user',UserSchema);

module.exports = User;