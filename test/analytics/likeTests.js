import { expect } from 'chai';
import request from 'supertest';
import { testUsers, testThoughts } from '../db';

export const likeTests = (app) => {

    describe('Like tests', () => {

        describe('GET /likes', () => {
            it('Return likes for thought - Success', async () => {

                const { body } = await request(app)
                    .get('/likes')
                    .send({ thought: testThoughts[0] })
                    .expect(200);

                expect(body.error).to.be.undefined;
                expect(body).to.be.an('array').with.length(3);
            })
        })

        const newLike = {
            thought: testThoughts[2],
            user: testUsers[2]
        }

        describe('POST /likes', () => {
            it('Adds new like - Success', async () => {

                const { body } = await request(app)
                    .post('/likes')
                    .send(newLike)
                    .expect(200);

                newLike._id = body._id;

                expect(body.error).to.be.undefined;
                expect(body._id).to.not.be.undefined;
            });

            it('Adds new like - Failed on duplicate', async () => {

                const { body } = await request(app)
                    .post('/likes')
                    .send(newLike)
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Like already exists');
            });

            it('Adds new like - Failed on no user data in request', async () => {

                const { body } = await request(app)
                    .post('/likes')
                    .send({
                        thought: testThoughts[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add like');
            });

            it('Adds new like - Failed on no thought data in request', async () => {

                const { body } = await request(app)
                    .post('/likes')
                    .send({
                        user: testUsers[2]
                    })
                    .expect(400);

                expect(body.error).to.not.be.undefined;
                expect(body.error).to.equal('Failed to add like');
            });
        })

        describe('Delete /likes', () => {
            it('Deletes like - Success', async () => {

                const { body } = await request(app)
                    .delete('/likes')
                    .send({ like: newLike })
                    .expect(204);

                expect(body.error).to.be.undefined;
            })
        })
    })
}