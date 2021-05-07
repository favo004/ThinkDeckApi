import express from 'express';
import cors from 'cors';
import { connectDb } from './db/db';
import { seedDb } from './seed/seed';

import { logger } from './utils/logger';

import userRoutes from './routes/userRoutes';

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost'

const seeding = false;

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

app.use('/api', userRoutes)

connectDb().then(async() => {
    if(seeding){
        seedDb();
    }

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        //logger.info(`Server started and running on http://${host}:${port}`)
    })
})
