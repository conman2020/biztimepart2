process.env.NODE_ENV = 'test';
const request = require ('supertest');
const app = require('../app');
const db = require('../db')


let testCompany;
beforeEach(async () => {
    const result = await db.query (`INSERT INTO companies (code, name, description) VALUES ('Bob', 'lee', 'wowza') RETURNING code, name, description`);
    testCompany = result.rows[0];
})

afterEach( async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll( async () => {
    await db.end()
})
describe ("Hope this works", () =>{
    test ("BLAH", ()=> {
        console.log(testCompany);
        expect(1).toBe(1);

    })
})

describe("Get /companies", ()=> {
    test("Get a list with one user", async ()=>{
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]})
    })
})
describe("Get /companies/:code",() => {
    test("Gets a single user", async () => {
        const res = await request(app).get(`/companies/${testCompany.code}`)
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ companies: testCompany})
    })
})

describe("Get /companies/:code",() => {
    test("Gets a 404 error invalid user", async () => {
        const res = await request(app).get(`/companies/0`)
        expect(res.statusCode).toBe(404);
    })
})


describe("Post /companies",() => {
    test("Gets a 201 good user", async () => {
        const res = await request(app).post('/companies').send({  name:'DOW JONES', description: 'ETF'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: {code: 'dow-jones', name: 'DOW JONES', description:'ETF'}
        })
    })
})



describe("Patch /companies",() => {
    test("Gets a 404 error invalid user", async () => {
        const res = await request(app).patch(`/companies/detailed/${testCompany.code}`).send({ name: 'wow', description: 'JEEPERSCREEPERS'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            company: { code: 'Bob', name: 'wow', description:'JEEPERSCREEPERS'}
        })
    })
})

describe("Delete /companies",() => {
    test("Delete test user", async () => {
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg: "DELETED!"})
    
    })
})

describe("Delete /companies",() => {
    test("Try to Delete test user that does not exist will get 404", async () => {
        const res = await request(app).delete(`/companies/corgies`);
        expect(res.statusCode).toBe(404);
      
    
    })
})