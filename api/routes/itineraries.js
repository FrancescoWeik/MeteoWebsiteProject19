// Route di "itineraries"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

// Connessione al DB
const db = mongoose.connection;


/* Definizione del metodo GET: ricerca gli itinerari appartenenti allo user specificato.
Richiede un oggetto JSON nei parametri della richiesta con il campo:
- "user_id": l'ID dell'utente di cui si vuole ottenere la lista degli itinerari.*/
router.get('/:user_id', async(req,res) => {
    try{

        let founduser = await User.findById(req.params.user_id);      // Cerca l'utente tramite l'ID inserito nel body della request
        res.status(201).json(founduser.itinerary);                  // Restituzione nella risposta della lista di itinerary dell'utente

    } catch(err){
        res.status(400).send("User with id: "+req.params.user_id+" not found");      // Messaggio in caso di errore
    }
});

/* Definizione del metodo POST: crea un itinerario vuoto e lo salva,
connettendolo ad un utente specificato.
Richiede un oggetto JSON nel body della richiesta con il campo:
- "user_id": l'ID dell'utente a cui si vuole aggiungere l'itinerario.
- "itinerary_name": nome dell'itinerario da aggiungere all'utente
*/

router.post('/', async (req, res) => {

    const itineraryNameExist = await User.findOne({"itinerary.name": req.body.itinerary_name, "_id": req.body.user_id});
    //console.log(itineraryNameExist);
    if(itineraryNameExist) return res.status(400).send({
        error: "Itinerary Name already exists"
    });

    try{
        let userfound = await User.findOne({_id: req.body.user_id});        // Ricerca dell'utente con l'ID specificato

        if(req.body.itinerary_name==null){                                        // Se i campi email e/o password sono null, viene mandato un messaggio di errore
            return res.status(400).send({error: "Error you need to insert a name"});
        }else if(req.body.itinerary_name==""){
            return res.status(400).send({error: "Error you need to insert a name"});
        }
        let newitinerary = new Itinerary({
            name: req.body.itinerary_name
        });

        await User.updateOne(                                               // Aggiornamento della lista di itinerari di tale utente, aggiungendo un elemento
            {"_id" : userfound._id},
            {"$push" : {"itinerary" : newitinerary}}
        );

        res.status(201).send({
            success : 'Itinerary saved and binded successfully to user '+req.body.user_id
        });  // Messaggio di risposta
    }catch{
        res.status(400).send("User with id: "+ req.body.user_id +" not found");                     // Messaggio in caso di errore
    }

});

/* Definizione del metodo DELETE: elimina un determinato itinerario dalla lista di itinerari dell'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- "user_id": l'ID dell'utente a cui si vuole rimuovere l'itinerario
- "itinerary_name": nome dell'itinerario da cancellare dall'utente*/

router.delete('/deleteName', async (req,res) =>{
    try{
        await User.updateOne(
            { "_id": req.body.user_id},
            {"$pull" : {"itinerary": {"name" : req.body.itinerary_name}}}
        );
        res.status(201).send("Itinerary "+req.body.itinerary_name+" deleted\nUser "+req.body.user_id+"updated.\n");
    }catch(err){
        res.status(400).send({error: err});
    }
});

/* Definizione del metodo DELETE: elimina un determinato itinerario dalla lista di itinerari dell'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- "user_id": l'ID dell'utente a cui si vuole rimuovere l'itinerario
- "itinerary_id": l'ID dell'itinerario che si intende eliminare.*/
router.delete('/', async (req,res)=> {

    try{

        await User.updateOne(                                                 // Aggiornamento della lista di itinerari dell'utente specificato, tramite la rimozione
            { "_id": req.body.user_id},                                       // l'itinerario corrispondente all'ID specificato
            { "$pull" :  {"itinerary" : {"_id" : req.body.itinerary_id} } }
        );
        
        res.status(201).send({
            success : "Itinerary "+req.body.itinerary_id+" deleted\nUser "+req.body.user_id+" updated.\n"
        });  // Messaggio di risposta
    }catch(err){
        res.status(400).send({
            error : "Itinerary "+req.body.itinerary_id+" not found.\n"
        });   // Messaggio in caso di errore
    }

});

module.exports = router;