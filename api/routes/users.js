// Route di "users"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const User = require('../models/user');
const Itinerary = require('../models/itinerary');
const MeteoComponent = require('../models/meteoComponent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connessione al DB
const db = mongoose.connection;

// Definizione del metodo GET: ricerca di tutti gli user.
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();       // Ricerca degli user
        console.log(users);
        res.status(201).json(users);           // Restituzione della lista nella risposta
    } catch (err) {
        res.status(400).json({ message: err });   // Messaggio in caso di errore
    }
});

// Definizione del metodo GET con path "/:userId": ottiene le informazioni sullo user con id "userId" utilizzando la API.
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);        // Ricerca dell'utente con tale ID
        res.status(201).json(user);                                 // Restituzione dell'utente nella risposta
    } catch (err) {
        res.status(400).json({ message: err });   // Messaggio in caso di errore
    }
});

// Definizione del metodo GET con path "/:email": ottiene le informazioni sullo user con la mail "email" utilizzando la API.
router.get('/:email', async (req, res) => {
    try {
        const users = await User.findOne({ email: req.params.email }) // Ricerca dell'utente con tale email
            .map((entry) => {
                return {
                    self: '/api/v1/users/' + entry.id,
                    email: entry.email,
                    itinerary: entry.itinerary
                }
            });
        res.status(201).json(users);            // Restituzione dell'utente nella risposta
    } catch (err) {
        res.status(400).json({ message: err });   // Messaggio in caso di errore
    }
});

/* Definizione del metodo POST: crea uno user e lo salva nel DB.
Richiede un oggetto JSON nel body della richiesta con i campi:
- email: la mail del nuovo utente
- password: la password del nuovo utente.
*/
router.post('', async (req, res) => {

    const emailExist = await User.findOne({ email: req.body.email });     // Controlla se un utente con tale email esiste già
    if (emailExist) return res.status(400).send({
        error: 'Email already exists'
    });                                                                 // Se esiste, viene mandato un messaggio di errore
    if (req.body.password == null) {                                        // Se i campi email e/o password sono null, viene mandato un messaggio di errore
        return res.status(400).send("Error");
    } else if (req.body.password == "") {
        return res.status(400).send("Error");
    }
    if (!req.body.email || typeof req.body.email != 'string' || !checkIfEmailInString(req.body.email)) {   // Se la mail non è nel formato corretto, restituisce un errore
        return res.status(400).send({ error: 'The field "email" must be a non-empty string, in email format' });
        //return;
    };
    //Hash passwords
    const salt = await bcrypt.genSalt(10)       // Genera una chiave complessa, il numero indica la "complessità" della stringa generata
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({             // Creazione di un nuovo utente
        email: req.body.email,
        password: hashedPassword
        //password: req.body.password
    });

    try {
        const savedUser = await user.save();
        console.log(savedUser);
        let userId = savedUser.id;
        //res.status(201).send(savedUser);
        res.location("/api/v1/users/" + userId).status(201).send(savedUser);
    } catch (err) {
        res.status(400).send(err);          // Messaggio in caso di errore
    }
});

/* Definizione del metodo POST con path "/login": controlla se l'utente che sta eseguendo il log-in esiste e,
in caso positivo, la correttezza della password. In questa ultima situazione, crea e assegna un token.
Richiede un oggetto JSON nel body della richiesta con i campi:
- email: la email dell'utente di cui si vuole approvare il log-in
- password: la password dell'utente di cui si vuole approvare il login.
*/
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });   // Controlla se un utente con tale mail esiste
    if (!user) return res.status(400).send({ error: 'Email not found' });   // Se l'utente non esiste, manda un messaggio di errore
    // Altrimenti..
    if (req.body.password == null) return res.status(400).send({ error: 'You need to write the password too' });
    if (typeof req.body.password != 'string') return res.status(400).send({ error: 'Password must be of the type STRING' });
    const validPass = await bcrypt.compare(req.body.password, user.password);   // Controlla la correttezza della password
    if (!validPass) return res.status(400).send({ error: 'Invalid password' });             // Se è invalida, manda un messaggio di errroe
    // Altrimenti..
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 86400 });          // Crea e assegna un token utile a sapere che l'utente è loggato
    res.header('auth-token', token).status(201).send({ token: token });                    // Manda il token nella response
})


/* Definizione del metodo DELETE: elimina un determinato user tramite l'id.
Richiede un oggetto JSON nel body della richiesta con il campo:
- user_id: l'ID dell'utente che si intende eliminare.
*/
router.delete('', async (req, res) => {

    try {
        var usertomodify = await User.findOne({ _id: req.body.user_id });
        var infolenIT = Object.keys(usertomodify.itinerary).length;

        await User.deleteOne({ _id: req.body.user_id });
        if (infolenIT > 0)
            res.status(201).send("User with id " + req.body.user_id + " successfully deleted.\n" + infolenIT + " itineraries completely cleared.\n");
        else
            res.status(201).send("User with id " + req.body.user_id + " successfully deleted.\n");

    } catch (err) {
        res.status(400).send("User with id " + req.body.id + " not found.");
    }

});


/* Definizione del metodo DELETE con path '/:email': elimina lo user identificato dalla email "email".
*/
router.delete('/:email', async (req, res) => {
    try {
        let removedUser = await User.deleteOne({ email: req.params.email })
        res.status(201).send("User with email " + req.params.email + " successfully deleted.");
        console.log("User with email " + req.params.email + " successfully deleted.");
    } catch (err) {
        res.status(400).send("User with email " + req.params.email + " not found.");
        console.log("User with email " + req.params.email + " not found.");
    }
});

/* Definizione del metodo PATCH con path "/:userId": aggiorna la mail dello user identificato dall'id "userId".
Richiede un oggetto JSON nel body della richiesta con il campo:
- email: la nuova email dell'utente specificato.*/
router.patch('/:userId', async (req, res) => {
    if (!req.body.email || typeof req.body.email != 'string' || !checkIfEmailInString(req.body.email)) {       // Verifica del formato della mail.
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    const toFind = await User.findOne({ email: req.body.email })
    if (toFind) {
        res.status(400).json({ error: 'This email is already taken!' });
    } else {
        try {
            const updatedUser = await User.updateOne(    // Aggiornamento del campo email
                { _id: req.params.userId },
                { $set: { email: req.body.email } }
            );
            res.status(201).json(updatedUser);                      // Restituzione dell'utente con le informazioni aggiornate
        } catch (err) {
            res.status(400).json({ message: err });
        }
    }
})

// Funzione ausiliaria: verifica che il campo compilato sia effettivamente una stringa
function checkIfEmailInString(text) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}


module.exports = router;
