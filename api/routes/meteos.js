// Route di "meteos"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Meteo = require('../models/meteo');

// Variabili globali
var meteoUrl = "";


// Definizione del metodo GET: restituisce un messaggio che informa riguardo la gestione della richiesta
router.get('/', (req,res,next) => {
    res.status(201).json({
        message: 'Handling GET request to /meteos'
    });
});


// Funzione ausiliaria per la richiesta delle coordinate.
function requestcoords(path,callback){
    request(path, function(err, response, body) {
        if (err) {
            callback(err,null)
        } else {
            city_json=JSON.parse(body);
            callback(null,city_json);
        }
    });
}

// Funzione necessaria per evitare conflitti causati dai caratteri speciali nella ricerca di una città
function cleanUpSpecialChars(str) 
{ 
       str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
       str = str.replace(/[àáâãäå]/g,"a");
       str = str.replace(/[ÈÉÊË]/g,"E");
       str = str.replace(/[èéëê]/g,"e");
       str = str.replace(/[ùúûü]/g,"u");
       str = str.replace(/[ÜÛÙÚ]/g,"U");
       str = str.replace(/[ìíîï]/g,"i");
       str = str.replace(/[ÏÎÍÌ]/g,"I");
       str = str.replace(/[öôóøò]/g,"o");
       str = str.replace(/[ØÕÖÒÔ]/g,"O");
       str = str.replace(/[ÿý]/g,"y");
       str = str.replace(/[Ý]/g,"Y");
       return str
}

// Definizione del metodo GET con path "/cityName": ottiene i dati del meteo in forma di JSON della città "cityName".
router.get('/:cityName', function(req,res){
    let rightCity = cleanUpSpecialChars(req.params.cityName); 
    if(!rightCity)
        res.status(400).send("You must provide a city name in the URL.");
    else{
        requestcoords('https://photon.komoot.io/api/?q='+rightCity+'&limit=1&lang=en',function(err,jsoncoords){
        if(err){
            res.status(400).send("Error in the request. Please retry.");
        } else if(Object.keys(jsoncoords.features).length == 0){
            res.status(400).send("You must provide a valid city name in the URL.");
        }else {
            let lat = jsoncoords.features[0].geometry.coordinates[1];
            let lon = jsoncoords.features[0].geometry.coordinates[0];
            meteoUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=metric&appid='+process.env.API_KEY;
            
            request(meteoUrl, function(error,response,body){     // Viene mandata una richiesta all'URL specificato, passando come parametro la funzione per la gestione della response
                const meteo_json=JSON.parse(body);                      // Parsing del body in JSON
                if(!jsoncoords.features[0].properties.county)
                    meteo_json.name = jsoncoords.features[0].properties.name + ", "+jsoncoords.features[0].properties.country;
                else
                    meteo_json.name = jsoncoords.features[0].properties.name + ", "+jsoncoords.features[0].properties.county+", "+jsoncoords.features[0].properties.country;
                res.status(200).send(meteo_json);
            });
        }
        });
    }
});

// Definizione del metodo POST: crea un oggetto meteo
router.post('/',function(req,res){
    Meteo.create(req.body).then(function(meteo){
        res.status(201).send(meteo);
    });
});

module.exports = router;