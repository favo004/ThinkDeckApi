import { expect } from 'chai';
import request from 'supertest';
import { ObjectId } from 'bson';
import { testUsers, testThoughts } from '../db';


export const thoughtTests = (app) => {

    describe('GET /thoughts', () => {
        it('Returns thoughts by user - Success', async () => {
            
            const { body } = await request(app)
                .get('/thoughts')
                .send({user: testUsers[0]})

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
            expect(body).to.have.length(2);
        });

        it('Returns comments for thought - Success', async () => {
            const { body } = await request(app)
            .get('/thoughts')
            .send({commentTo: testThoughts[0]})

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
            expect(body).to.have.length(1);
        });
    })

    const thought = {
        "thought": {
            "_id": ObjectId(),
            "user": testUsers[1],
            "thoughtBody": "Some thought for testing!"
        }
    }

    describe('POST /thoughts', () => {
        it('Adds new thought - Success', async () => {
            
            const { body } = await request(app)
                .post('/thoughts')
                .send(thought)

            expect(body.error).to.be.undefined;
            expect(body.thoughtBody).to.equal("Some thought for testing!");
            expect(body.user).to.equal(testUsers[1]._id.toString());
        })

        it('Adds new thought - Fails on duplicate', async () => {
            
            const { body } = await request(app)
                .post('/thoughts')
                .send(thought);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("Thought already exists");
        })
    })

    describe('PUT /thoughts', () => {
        it('Updates thought - Success', async () => {

            thought.thought.thoughtBody = "Holy moley this changed!";

            const { body } = await request(app)
                .put('/thoughts')
                .send(thought)

            expect(body.error).to.be.undefined;
            expect(body.thoughtBody).to.equal("Holy moley this changed!");
            expect(body.user).to.equal(testUsers[1]._id.toString());
        })
    })

    describe('DELETE /thoughts', () => {
        it('Deletes thought - Success', async () => {

            const { body } = await request(app)
                .delete('/thoughts')
                .send(thought)

            expect(body.error).to.be.undefined;
            expect(body).to.be.empty;
        });

        it('Deletes thought - Fail due to not existing', async () => {

            const { body } = await request(app)
                .delete('/thoughts')
                .send(thought)

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("Thought not found");
        });
    })

}