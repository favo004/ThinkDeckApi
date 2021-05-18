import mongoose from 'mongoose';
import { connectDb } from '../db/db';
import { logger } from '../utils/logger';
import { UserSchema } from '../models/userModel';
import { users } from './users';
import { ThoughtSchema } from '../models/thoughtModel';
import { thoughts } from './thoughts';

require('dotenv').config()

const User = mongoose.model('User', UserSchema);
const Thought = mongoose.model('Thought', ThoughtSchema);

connectDb()
.then(async (connection) => {
    await deleteCollections();
    await addData();
    
    await connection.close();
})


export const seedDb = async () => {
    deleteCollections()
    .then(() => {
        addData();
    }).catch(err => {
        logger.error(`Error seeding db: ${err}`)
    }) 
}

const deleteCollections = async () => {
    return Promise.all([
        User.deleteMany({}),
        Thought.deleteMany({})
    ]).catch(err => {
        logger.error(`deleteTables() Error deleting current collections during seeding. ${err}`)
    }) 
}

const addData = async () => {
    logger.info(`seedData() Seeding data from seed.js`)

    return Promise.all([
        User.create(users)
    ])
    .then(async (users) => {
        thoughts[0].user = users[0][0];
        thoughts[1].user = users[0][1];
        thoughts[2].user = users[0][0];
        
        let t1 = await Thought.create(thoughts[0]);
        thoughts[1].commentTo = t1;
        let t2 = await Thought.create(thoughts[1]);
        let t3 = await Thought.create(thoughts[2]);
        
        console.log('Data added...')
    })
    .catch(err => {
        logger.error(`seedData() Error adding data during seeding. ${err}`)
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