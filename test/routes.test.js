import express from 'express';
import userRoutes from '../routes/userRoutes';
import thoughtRoutes from '../routes/thoughtRoutes';

import { assert, expect } from 'chai';
import request from 'supertest';
import { connectDb, seedTestData } from './db';

require('dotenv').config()

process.env.NODE_ENV = 'test';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(thoughtRoutes);

before(async () => {
    await connectDb();
    await seedTestData();
})

after(async () => {

})

describe('User routes', () => {

    describe('GET /users' , () => {
        it('Gets users - Success', async () => {
            const { body } = await request(app).get('/users')

            expect(body).to.be.an('array').that.has.length(3);
                
        })
    })


    const testUser = { 
        "user": 
        {
            "username": "testname3232",
            "password": "passwordTotallySecure",
            "email": "testname@email.com",
            "bio": "TeeHeeHeeHeeeee"
        }
    };

    describe('POST /users', () => {
        it('Adds new user to db - Success', async () => {
            const { body } = await request(app)
                .post('/users')
                .send(testUser);

            updateId = body._id;

            expect(body.error).to.be.undefined;
            expect(body._id).to.not.be.undefined;

        })
    })

    describe('POST /users', () => {
        it('Adds new user to db - Fail on duplicate username', async () => {
            testUser.user.email = "testname232@email.com"
            const { body } = await request(app)
                .post('/users')
                .send(testUser);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal('username already exists');
            expect(body._id).to.be.undefined;            
        })
    })

    describe('POST /users', () => {
        it('Adds new user to db - Fail on duplicate email', async () => {
            testUser.user.email = "testname@email.com";
            testUser.user.username = "testnameV2ForTest";
            const { body } = await request(app)
                .post('/users')
                .send(testUser);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal('email already exists');
            expect(body._id).to.be.undefined;

        })
    })

    let updateId = "";

    describe('PUT /users', () => {
        it('Updates users username - Success', async () => {
            
            testUser.user._id = updateId;
            testUser.user.username = "testnameV2";
            testUser.user.email = "testname@email.com";

            const { body } = await request(app)
                .put('/users')
                .send(testUser);

            expect(body.error).to.be.undefined;
            expect(body.username).to.equal('testnameV2');
            expect(body.email).to.equal('testname@email.com');
                
        })
    })

    describe('DELETE /users', () => {
        it('Delete user - Success', async () => {
            const { body } = await request(app)
                .delete('/users')
                .send(testUser)  
                .expect(204)

            expect(body.error).to.be.undefined;
            expect(body).to.be.empty;
        })
    })

    describe('DELETE /users', () => {
        it('Delete user - Fails on user not existing', async () => {
            const { body } = await request(app)
                .delete('/users')
                .send(testUser)  
                .expect(400)

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal('User not found');
        })
    })
})
