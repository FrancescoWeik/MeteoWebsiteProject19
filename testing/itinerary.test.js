const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');

jest.useFakeTimers();

beforeEach(async()=>{
    console.log('beforeEach')
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaOne"
    })
})
afterEach(async()=>{
    console.log('afterEach');
    await request(app).delete('/itineraries/deleteName')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaOne"
    })
    await request(app).delete('/itineraries/deleteName')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaDue"
    })
})

// Test relativi agli itinerary per Jest

test('Restituisce gli itinerari di un determinato User ', async ()=>{
    await request(app).get('/itineraries/5fd228f6cb193459c49725ff')
    .expect(201)
}, 30000)

test('Dà errore perchè non esiste uno user con tale id', async()=>{
    await request(app).get('/itineraries/asdpojhnodfafrwqeirbuocb')
    .expect(400)
}, 30000)

test('Crea un itinerario e lo inserisce in un determinato user', async ()=>{
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaDue"
    })
    .expect(201)
}, 30000)

test('Ritorna un errore poichè mancano dei campi nel body', async ()=>{
    await request(app).get('/itineraries')
    .expect(404)
}, 30000)

test('Ritorna errore perchè i campi passati non sono in formato corretto', async()=>{
    await request(app).get('/itineraries/125551')
    .expect(400)
})

test('Elimina un itinerario di un determinato user', async ()=>{
    await request(app).delete('/itineraries/deleteName')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaOne"
    })
    .expect(201)
})

test('Dà errore in quanto manca il campo nome', async ()=>{
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
    })
    .expect(400)
}, 30000)

test('Dà errore in quanto il formato di itinerary_name è scorretto', async ()=>{
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": 11111
    })
    .expect(400)
})