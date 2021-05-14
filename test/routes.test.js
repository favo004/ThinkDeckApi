import express from 'express';
import { expect } from 'chai';
import request from 'supertest';
import { connectDb, seedTestData, testUsers, testThoughts, testLikes, testDislikes, testHighlights } from './db';


import userRoutes from '../routes/userRoutes';
import thoughtRoutes from '../routes/thoughtRoutes';
import analyticsRoutes from '../routes/analyticsRoutes';
import followRoutes from '../routes/followRoutes';
import messageRoutes from '../routes/messageRoutes';

import { userTests } from './users/userTests';
import { thoughtTests } from './thoughts/thoughtTests';
import { likeTests } from './analytics/likeTests';
import { dislikeTests } from './analytics/dislikeTests';
import { highlightTests } from './analytics/highlightTests';
import { followTests } from './follows/followTest';
import { messageTests } from './messages/messageTests';

require('dotenv').config()

process.env.NODE_ENV = 'test';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(thoughtRoutes);
app.use(analyticsRoutes);
app.use(followRoutes);
app.use(messageRoutes);

before(async () => {
    await connectDb();
    await seedTestData();
})

after(async () => {

})

describe('User routes', () => {
    userTests(app);
})

describe('Thought routes', () => {
    thoughtTests(app);
})

describe('Analytics routes', () => {
    likeTests(app);
    dislikeTests(app);
    highlightTests(app);
})

describe('Follow routes', () => {
    followTests(app);
})

describe('Message routes', () => {
    messageTests(app);
})