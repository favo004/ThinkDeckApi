import mongoose from 'mongoose';
import {ObjectId} from 'bson';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserSchema } from '../models/userModel';
import { ThoughtSchema } from '../models/thoughtModel';
import { DislikeSchema, HighlightSchema, LikeSchema } from '../models/analyticsModel';
import { FollowSchema } from '../models/followModel';
import { MessageSchema } from '../models/messageModel';

const mongoServer = new MongoMemoryServer();

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

export const testUsers = [
    {
        "_id": ObjectId(),
        "username": "Jarsher",
        "password": "password",
        "email": "jarsher@email.com",
        "bio": "Here we go again! WOOOT"
    },
    {
        "_id": ObjectId(),
        "username": "Hooplah",
        "password": "password",
        "email": "hooplah@email.com",
        "bio": "I am the best, around! No one is ever going to bring me down!"
    },
    {
        "_id": ObjectId(),
        "username": "Marsh",
        "password": "password",
        "email": "marsh@email.com",
        "bio": ""
    }
]

export const testThoughts = [
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

export const testLikes = [
    {
        "user": testUsers[0],
        "thought": testThoughts[0]
    },
    {
        "user": testUsers[1],
        "thought": testThoughts[0]
    },
    {
        "user": testUsers[2],
        "thought": testThoughts[0]
    },
    {
        "user": testUsers[0],
        "thought": testThoughts[3]
    }
]

export const testDislikes = [
    {
        "user": testUsers[0],
        "thought": testThoughts[2]
    },
    {
        "user": testUsers[1],
        "thought": testThoughts[1]
    },
    {
        "user": testUsers[2],
        "thought": testThoughts[1]
    },
    {
        "user": testUsers[1],
        "thought": testThoughts[3]
    }
]

export const testHighlights = [
    {
        "user": testUsers[1],
        "thought": testThoughts[0]
    },
    {
        "user": testUsers[2],
        "thought": testThoughts[0]
    }
]

export const testMessages = [
    {
        "_id": ObjectId(),
        "sentTo": testUsers[0],
        "sentFrom": testUsers[1],
        "messageBody": "Oh hey friend!"
    },
    {
        "_id": ObjectId(),
        "sentTo": testUsers[1],
        "sentFrom": testUsers[0],
        "messageBody": "Hello mofo!"
    },
    {
        "_id": ObjectId(),
        "sentTo": testUsers[0],
        "sentFrom": testUsers[2],
        "messageBody": "You're a bum!"
    }
]

export const testFollows = [

    {
        "_id": ObjectId(),
        "user": testUsers[0],
        "follow": testUsers[2]
    },
    {
        "_id": ObjectId(),
        "user": testUsers[1],
        "follow": testUsers[2]
    },
    {
        "_id": ObjectId(),
        "user": testUsers[2],
        "follow": testUsers[0]
    }
]

export const seedTestData = async () => {
    const User = mongoose.model('User', UserSchema);
    const Thought = mongoose.model('Thought', ThoughtSchema);
    const Like = mongoose.model('Like', LikeSchema);
    const Dislike = mongoose.model('Dislike', DislikeSchema);
    const Highlight = mongoose.model('Highlight', HighlightSchema);
    const Follow = mongoose.model('Follow', FollowSchema);
    const Message = mongoose.model('Message', MessageSchema)

    await Promise.all([
        User.deleteMany({}),
        Thought.deleteMany({}),
        Like.deleteMany({}),
        Dislike.deleteMany({}),
        Highlight.deleteMany({}),
        Follow.deleteMany({}),
        Message.deleteMany({})
    ])

    // Set thought as comment
    testThoughts[3].commentTo = testThoughts[0];

    await Promise.all([
        User.create(testUsers),
        Thought.create(testThoughts),
        Like.create(testLikes),
        Dislike.create(testDislikes),
        Highlight.create(testHighlights),
        Follow.create(testFollows),
        Message.create(testMessages)
    ])
}