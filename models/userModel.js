import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { DislikeSchema, HighlightSchema, LikeSchema } from './analyticsModel';
import { FollowSchema } from './followModel';
import { ThoughtSchema } from './thoughtModel';
import { MessageSchema } from './messageModel';

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

UserSchema.pre('remove', (next) => {
    // Before we remove user we must remove all of their thoughts, following/followers, likes/dislikes and messages
    // Likes.deleteMany().where({userId: this._id});
    // Dislikes.deleteMany().where({userId: this._id});
    // Highlights.deleteMany().where({userId: this._id});
    // Follows.deleteMany().or([{userId: this._id}, {followId: this._id}]);
    // Thoughts.deleteMany().where({userId: this._id});
    // Messages.deleteMany().or({sentTo: this._id}, {sentFrom: this._id});

    console.log('User was removed!');
    next();
})

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}