// Modello di un oggetto "meteoComponent"

const mongoose = require('mongoose');

const MeteoComponentSchema = mongoose.Schema({

    cityName:{
        type: String,
        required: [true, 'The name of the city is strictly required']
    },

    date:{
        type: String,
        required: [true, 'Date is strictly required']
    },

    dataUpdatedOn:{
        type : String
    },

    available : {
        type : Boolean
    },
    
    icon : {
        type : String
    },

    main : {
        type : String
    },

    temp_Max: {
        type: String
    },

    temp_Min: {
        type: String
    },

    temp : {
        type : String
    },

    humidity : {
        type : String
    },

    wind_deg : {
        type : String
    },

    wind_speed : {
        type : String
    },

});

// Aggiunta del modello al DB
const MeteoComponent = mongoose.model('meteoComponent',MeteoComponentSchema);

module.exports = MeteoComponent;