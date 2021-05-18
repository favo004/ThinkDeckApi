import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { DislikeSchema, HighlightSchema, LikeSchema } from './analyticsModel';
import { FollowSchema } from './followModel';
import { ThoughtSchema } from './thoughtModel';
import { MessageSchema } from './messageModel';

import { logger } from '../utils/logger';
import { encrpytPassword } from '../controllers/authController';

const Likes = mongoose.model('Likes', LikeSchema);
const Dislikes = mongoose.model('Dislikes', DislikeSchema);
const Highlights = mongoose.model('Highlights', HighlightSchema);
const Follows = mongoose.model('Follows', FollowSchema);
const Thoughts = mongoose.model('Thoughts', ThoughtSchema);
const Messages = mongoose.model('Messages', MessageSchema);

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    password:{
        type: String
    },
    bio: {
        type: String
    },
    imageUrl: {
        type: String
    },
    themeUrl: {
        type: String
    },
    createdDate:{
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists'
})

UserSchema.pre('save', async function() {
    if(this.password){
        this.password = await encrpytPassword(this.password);
    }
})

UserSchema.pre('findOneAndDelete', function() {
    // Before we remove user we must remove all of their thoughts, following/followers, likes/dislikes and messages

    Promise.all([
        Likes
            .deleteMany()
            .where({ user: this._id })
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting likes ${err}`);
                    throw new Error("Failed to delete likes of user being removed");
                }
            }),
        Dislikes
            .deleteMany()
            .where({ user: this._id })
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting dislikes ${err}`);
                    throw new Error("Failed to delete dislikes of user being removed");
                }
            }),
        Highlights
            .deleteMany()
            .where({ user: this._id })
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting highlights ${err}`);
                    throw new Error("Failed to delete highlights of user being removed");
                }
            }),
        Follows
            .deleteMany()
            .or([{ user: this._id }, { follow: this._id }])
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting follows ${err}`);
                    throw new Error("Failed to delete follows of user being removed");
                }
            }),
        Thoughts
            .deleteMany()
            .where({ user: this._id })
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting thoughts ${err}`);
                    throw new Error("Failed to delete thoughts of user being removed");
                }
            }),
        Messages
            .deleteMany()
            .or({ sentTo: this._id }, { sentFrom: this._id })
            .exec((err) => {
                if (err) {
                    logger.error(`UserSchema.pre('findOneAndDelete') Error on deleting messages ${err}`);
                    throw new Error("Failed to delete messages of user being removed");
                }
            }),

        logger.info(`UserSchema.pre('findOneAndDelete') called successfully`)
    ])
})