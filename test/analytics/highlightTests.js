import { expect } from 'chai';
import request from 'supertest';
import { createToken } from '../../controllers/authController';
import { testUsers, testThoughts } from '../db';

export const highlightTests = (app) => {

    describe('Highlight tests', () => {

        describe('GET /highlights', () => {
            it('Return highlights for thought - Success', async () => {

                const { body } = await request(app)
                    .get('/highlights')
                    .send({ thought: testThoughts[0] })
                    .expect(200);

                expect(body.error).to.be.undefined;
                expect(body).to.be.an('array').with.length(2);
            })
        })

        const newHighlight = {
            thought: testThoughts[3],
            user: testUsers[2]
        }

        describe('POST /highlights', () => {

            const token = createToken(testUsers[2]);

            it('Adds new highlight - Success', async () => {

                const { body } = await request(app)
                    .post('/dislikes')
                    .set({Authorization: token})
                    .send(newHighlight)
                    .expect(200);

                expect(body.error).to.be.undefined;
                expect(body._id).to.not.be.undefined;
            });

            it('Adds new highlight - Failed on duplicate', async () => {

                const { body } = await request(app)
                    .post('/highlights')
                    .set({Authorization: token})
                    .send(newHighlight)
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Highlight already exists');
            });

            it('Adds new highlight - Failed on no user data in request', async () => {

                const { body } = await request(app)
                    .post('/highlights')
                    .set({Authorization: token})
                    .send({
                        thought: testThoughts[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add highlight');
            });

            it('Adds new highlight - Failed on no thought data in request', async () => {

                const { body } = await request(app)
                    .post('/highlights')
                    .set({Authorization: token})
                    .send({
                        user: testUsers[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add highlight');
            });
        })

        describe('Delete /highlights', () => {
            it('Deletes highlight - Success', async () => {

                const token = createToken(testUsers[2]);

                const { body } = await request(app)
                    .delete('/highlights')
                    .set({Authorization: token})
                    .send({ highlight: newHighlight })
                    .expect(204);

                expect(body.error).to.be.undefined;
            })
        })
    })
}