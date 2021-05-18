import { expect } from 'chai';
import request from 'supertest';
import { testFollows, testUsers } from '../db';
import {ObjectId} from 'bson';
import { createToken } from '../../controllers/authController';

export const followTests = (app) => {

    describe('GET /follows', () => {
        it('Returns followers for user - Success', async () => {

            const { body } = await request(app)
                .get('/follows')
                .send({user: testUsers[0]})
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
        })

        it('Returns following for user - Success', async () => {
            const { body } = await request(app)
                .get('/follows')
                .send({follow: testUsers[0]})
                .expect(200);

            expect(body.error).to.be.undefined;
            expect(body).to.be.an('array');
        })
    })

    const newFollow = {
        "follow": {
            "_id": ObjectId(),
            "user": testUsers[2],
            "follow": testUsers[1]
        }
    }

    describe('POST /follows', () => {

        const token = createToken(testUsers[2]);

        it('Adds new follow - Success', async () => {
            const { body } = await request(app)
                .post('/follows')
                .set({Authorization: token})
                .send(newFollow)
                .expect(200);

            expect(body.error).to.be.undefined;
            
        });

        it('Adds new follow - Fails on duplicate', async () => {
            const { body } = await request(app)
                .post('/follows')
                .set({Authorization: token})
                .send(newFollow)
                .expect(400);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("Follow already exists");
        });

        it('Adds new follow - Fails on user following themself', async () => {
            const selfFollow = {
                "follow": {
                    "user": testUsers[2],
                    "follow": testUsers[2]
                }
            }
            const { body } = await request(app)
                .post('/follows')
                .set({Authorization: token})
                .send(selfFollow)
                .expect(400);

            expect(body.error).to.not.be.undefined;
            expect(body.error).to.equal("User and follow need to be different");
        });
    })

    describe('DELETE /follow', () => {
        it('Deletes follow - Success', async () => {

            const token = createToken(testUsers[2]);

            const { body } = await request(app)
                .delete('/follows')
                .set({Authorization: token})
                .send(newFollow)
                .expect(204);

            expect(body.error).to.be.undefined;
        })
    })
}