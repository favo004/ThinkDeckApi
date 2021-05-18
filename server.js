import express from 'express';
import cors from 'cors';
import { connectDb } from './db/db';

import { logger } from './utils/logger';

import userRoutes from './routes/userRoutes';
import thoughtRoutes from './routes/thoughtRoutes';
import followRoutes from './routes/followRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import messageRoutes from './routes/messageRoutes';

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Requests
app.use((req, res, next) => {
    logger.info(`${req.originalUrl} ${req.method} ${req.ip}`)
    next();
})

// Capture http status 500 errors
app.use((err, req, res, next) => {
    res.status(500).send('Internal server error!');
    logger.error(`
    ${err.status || 500} - 
    ${res.statusMessage} - 
    ${err.message} - 
    ${req.originalUrl} - 
    ${req.method} - 
    ${req.ip}`);

    next();
})

// Add api routes
app.use(userRoutes);
app.use(thoughtRoutes);
app.use(followRoutes);
app.use(analyticsRoutes);
app.use(messageRoutes);

connectDb().then(async() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        //logger.info(`Server started and running on http://${host}:${port}`)
    })
})
