import { expect } from 'chai';
import request from 'supertest';
import { testMessages, testUsers } from '../db';
import { ObjectId } from 'bson';

export const messageTests = (app) => {


    describe('GET /messages', () => {
        it('Returns messages sent to user - Success', async () => {
            const { body } = await request(app)
                .get('/messages')
                .send({ sentTo: testUsers[0] })
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
        })

        it('Returns messages sent from user - Success', async () => {
            const { body } = await request(app)
                .get('/messages')
                .send({ sentFrom: testUsers[0] })
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
        })
    })

    const newMessage = {
        message: {
            "_id": ObjectId(),
            "sentTo": testUsers[2],
            "sentFrom": testUsers[1],
            "messageBody": "You're a bum!"
        }
    }

    describe('POST /messages', () => {
        it('Adds message - Success', async () => {
            const { body } = await request(app)
                .post('/messages')
                .send(newMessage)
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body.messageBody).to.equal("You're a bum!")
        })

    })

    describe('PUT /messages', () => {
        it('Updates message - Success', async () => {
            newMessage.message.messageBody = "You are a bum 2.0! Woot!"
            const { body } = await request(app)
                .put('/messages')
                .send(newMessage)
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body.messageBody).to.not.equal("You're a bum!")
            expect(body.messageBody).to.equal("You are a bum 2.0! Woot!")
        })

        it('Updates message - Fails on no data sent with request', async () => {

            const { body } = await request(app)
                .put('/messages')
                .send()
                .expect(400);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("Failed to update message");
        })
    })

    describe('DELETE /messages', () => {
        it('Deletes message - Success', async () => {
            const { body } = await request(app)
                .delete('/messages')
                .send(newMessage)
                .expect(204);

            expect(body.error).to.be.undefined;
        })

        it('Deletes message - Fails on not existing', async () => {
            const { body } = await request(app)
                .delete('/messages')
                .send()
                .expect(400);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("Failed to delete message");
        })
    })
}