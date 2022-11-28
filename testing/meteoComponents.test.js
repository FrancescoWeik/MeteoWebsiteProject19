const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');
jest.useFakeTimers();


beforeEach(async()=>{
    await request(app).delete('/meteoComponents/deleteAll')
    .send({
        "user_id" : "5fd2357bbab8df19cc70942e",
        "itinerary_id": "5fd23739bab8df19cc70942f"
    })
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fd228f6cb193459c49725ff",
        "itinerary_name": "ProvaOne"
    })
})
afterEach(()=>{

})

test('Ritorna tutti i meteoComponents facenti parte di un determinato itinerario di un determinato user', async ()=>{
    await request(app).get('/meteoComponents/5fd228f6cb193459c49725ff&5fd22907cb193459c4972600')
    .expect(201)
}, 30000)

test('Dà errore perchè non esiste uno user con tale id nè un itinerario con tale id', async()=>{
    await request(app).get('/meteoComponents/asdpojhnodfafrwqeirbuocbpodwaur8hgolsadfncjlbno&apodfiuhjapouigvhniph9owaefdsvc')
    .expect(400)
})

test('Crea un meteoComponent e lo inserisce nell itinerario indicato di un determinato user', async ()=>{
    await request(app).post('/meteoComponents')
    .send({
        "user_id": "5fd2357bbab8df19cc70942e",
        "itinerary_id": "5fd23739bab8df19cc70942f",
        "date": "2523032400",
        "cityName": "Trento"
    })
    .expect(201)
})

test('Ritorna un errore poichè manca il campo itinerary_id nell url', async ()=>{
    await request(app).get('/meteoComponents/5fccf1aa56821144446c430a&')
    .expect(404)
}, 30000)

test('Ritorna errore perchè i campi passati non sono in formato corretto', async()=>{
    await request(app).get('/meteoComponents/125551%23.5')
    .expect(404)
})

test('Elimina tutti i meteoComponents facenti parte di un determinato itinerario', async()=>{
    await request(app).delete('/meteoComponents/deleteAllName')
    .send({
        "itinerary_name": "ProvaOne",
        "user_id": "5fd228f6cb193459c49725ff"
    })
    .expect(201)
})

test('Restituisce errore in quanto la data è nel passato', async ()=>{
    await request(app).post('/meteoComponents')
    .send({
        "user_id": "5fd2357bbab8df19cc70942e",
        "itinerary_id": "5fd23739bab8df19cc70942f",
        "date": "1607814000",
        "cityName": "Trento"
    })
    .expect(400)
})



