import mongoose from 'mongoose';
import {ObjectId} from 'bson';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserSchema } from '../models/userModel';
import { ThoughtSchema } from '../models/thoughtModel';

const mongoServer = new MongoMemoryServer();

const User = mongoose.model('User', UserSchema);
const Thought = mongoose.model('Thought', ThoughtSchema);

export const connectDb = async () => {
    
    mongoose.Promise = Promise;
    mongoServer.getUri().then((mongoUri) => {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };

        mongoose.connect(mongoUri, options);
    })
}

let testUsers = [
    {
        "_id": ObjectId(),
        "username": "Jarsher",
        "password": "$2a$08$wilSc/9mGDQYiDRGDjFjR.2tba3XM5227IBI5WDqIroLRtp.iRgue",
        "email": "jarsher@email.com",
        "bio": "Here we go again! WOOOT"
    },
    {
        "_id": ObjectId(),
        "username": "Hooplah",
        "password": "$2a$08$wilSc/9mGDQYiDRGDjFjR.2tba3XM5227IBI5WDqIroLRtp.iRgue",
        "email": "hooplah@email.com",
        "bio": "I am the best, around! No one is ever going to bring me down!"
    },
    {
        "_id": ObjectId(),
        "username": "Marsh",
        "password": "$2a$08$wilSc/9mGDQYiDRGDjFjR.2tba3XM5227IBI5WDqIroLRtp.iRgue",
        "email": "marsh@email.com",
        "bio": ""
    }
]

let testThoughts = [
    {
        "_id": ObjectId(),
        "user": testUsers[0],
        "thoughtBody": 'hi'
    },
    {
        "_id": ObjectId(),
        "user": testUsers[0],
        "thoughtBody": "Weeeeeee another thought for me."
    },
    {
        "_id": ObjectId(),
        "user": testUsers[1],
        "thoughtBody": "I have thoughts!"
    },
    {
        "_id": ObjectId(),
        "user": testUsers[2],
        "thoughtBody": "Comment for you!"
    },
]

export const seedTestData = async () => {

    await Promise.all([
        User.deleteMany({}),
        Thought.deleteMany({})
    ])

    testThoughts[3].thought = testThoughts[0];

    await Promise.all([
        User.create(testUsers),
        Thought.create(testThoughts)
    ])

}