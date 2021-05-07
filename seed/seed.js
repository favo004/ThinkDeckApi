import mongoose from 'mongoose';
import { connectDb } from '../db/db';
import { logger } from '../utils/logger';
import { UserSchema } from '../models/userModel';
import { users } from './users';

require('dotenv').config()

const User = mongoose.model('User', UserSchema);

export const seedDb = async () => {
    Promise.all([
        User.deleteMany({})
    ]).then(() => {
        seedData();
    }).catch(err => {
        logger.error(`Error seeding db: ${err}`)
    }) 
}

const seedData = async () => {
    logger.info(`Seeding data from seed.js`)

    await users.map(u => {
        const newUser = new User(u);
        newUser.save()
        .catch((err) => logger.error(`Error saving new user to DB from Seed, ${newUser} ${err}`));
    })

    logger.info(`Finished seeding data from seed.js`)
}