import { expect } from 'chai';
import request from 'supertest';
import { createToken } from '../../controllers/authController';
import { testUsers, testThoughts } from '../db';

export const dislikeTests = (app) => {

    describe('Dislike tests', () => {

        describe('GET /dislikes', () => {
            it('Return dislikes for thought - Success', async () => {

                const { body } = await request(app)
                    .get('/dislikes')
                    .send({ thought: testThoughts[1] })
                    .expect(200);

                expect(body.error).to.be.undefined;
                expect(body).to.be.an('array').with.length(2);
            })
        })

        const newDislike = {
            thought: testThoughts[2],
            user: testUsers[1]
        }

        describe('POST /dislikes', () => {

            const token = createToken(testUsers[1]);

            it('Adds new dislikes - Success', async () => {

                const { body } = await request(app)
                    .post('/dislikes')
                    .set({Authorization: token})
                    .send(newDislike)
                    .expect(200);

                newDislike._id = body._id;

                expect(body.error).to.be.undefined;
                expect(body._id).to.not.be.undefined;
            });

            it('Adds new dislike - Failed on duplicate', async () => {

                const { body } = await request(app)
                    .post('/dislikes')
                    .set({Authorization: token})
                    .send(newDislike)
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Dislike already exists');
            });

            it('Adds new dislike - Failed on no user data in request', async () => {

                const { body } = await request(app)
                    .post('/dislikes')
                    .set({Authorization: token})
                    .send({
                        thought: testThoughts[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add dislike');
            });

            it('Adds new dislike - Failed on no thought data in request', async () => {

                const { body } = await request(app)
                    .post('/dislikes')
                    .set({Authorization: token})
                    .send({
                        user: testUsers[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add dislike');
            });
        })

        describe('Delete /dislikes', () => {
            it('Deletes dislike - Success', async () => {

                const token = createToken(testUsers[1]);

                const { body } = await request(app)
                    .delete('/dislikes')
                    .set({Authorization: token})
                    .send({ dislike: newDislike })
                    .expect(204);

                expect(body.error).to.be.undefined;
            })
        })

    })
}