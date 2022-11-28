// Route per la verifica dell'autenticazione -- DA AGGIORNARE

const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const User = require('../models/user');

// Definizione del metodo GET 
router.get('/', verify, async (req,res) => {
    let usertry = await User.findOne({_id: req.user._id});
    res.send(usertry);
});

module.exports = router;