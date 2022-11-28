const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');

jest.useFakeTimers();

beforeEach(async()=>{
    await request(app).delete('/users/testfunction@gmail.com')
    .send({
        "userMail": "testfunction@gmail.com"
    })
    await request(app).delete('/users/pinodaniele')
    .send({ 
        "userMail": "pinodaniele"
    })
    await request(app).post('/users')
    .send({
        "email":"delete@gmail.com",
        "password":"password"
    })
    console.log('beforeEach')
})
afterEach(()=>{
    console.log('afterEach');
})

// Test relativi agli user per Jest

test('Registra un utente con email "testfunction@gmail.com" e password "testpassword". ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "testfunction@gmail.com",
        "password": "testpassword"
    })
    .expect(201)
})


test('Restituisce un errore in quanto la mail non ha il formato corretto. ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "pinodaniele",
        "password": "testpassword"
    })
    .expect(400)
})


test('Restituisce un errore in quanto la password è vuota. ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "testfunction@gmail.com",
        "password":""
    })
    .expect(400)
})


test('Esiste un utente nel database.', async ()=>{
    await request(app).get('/users')
    .send({
    })
    .expect(201)
})

test('Permette all utente con email "user@domain.com" e password "password" di effettuare il login (user predefinito). ', async ()=>{
    await request(app).post('/users/login')
    .send({
        "email": "user@domain.com",
        "password": "password"
    })
    .expect(201)
})

test('Ritorna un errore in quanto nel login non è specificata la password', async()=>{
    await request(app).post('/users/login')
    .send({
        "email": "user@domain.com"
    })
    .expect(400)
})

test('Ritorna un errore in quanto durante il login non esiste utente con questa determinata mail',async()=>{
    await request(app).post('/users/login')
    .send({
        "email": "emailinesistente@inesistente.com",
        "password": "passwordInesistente"
    })
    .expect(400)
})

test('Ritorna un errore in quanto il campo password non ha il formato corretto',async()=>{
    await request(app).post('/users/login')
    .send({
        "email": "user@domain.com",
        "password": 1234567
    })
    .expect(400)
})

test('Cancella un utente dal database.', async ()=>{
    await request(app).delete('/users/delete@gmail.com')
    .expect(201)    // in questo caso 200 perchè non è un 201 created ma 200 OK
})

test('Restituisce un errore in quanto la mail non è una stringa', async ()=>{
    await request(app).post('/users')
    .send({
        "email": 12345,
        "password": "testpassword"
    })
    .expect(400)
})

test('Ritorna un errore in quanto la password è errata', async ()=>{
    await request(app).post('/users/login')
    .send({
        "email": "user@domain.com",
        "password": "passwordErrata"
    })
    .expect(400)
})