import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const Schema = mongoose.Schema;

export const LikeSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    thought:{
        type: Schema.Types.ObjectId, ref: 'Thought',
        required: true
    }
})

export const DislikeSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    thought:{
        type: Schema.Types.ObjectId, ref: 'Thought',
        required: true
    }
})

export const HighlightSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    thought:{
        type: Schema.Types.ObjectId, ref: 'Thought',
        required: true
    }
})



LikeSchema.pre('save', function() {
    
    const Dislikes = mongoose.model('Dislikes', DislikeSchema);

    // Delete a dislike if one exists with the same user and thought to ensure a user can't like and dislike a thought
    Dislikes.deleteOne().and([{user: this.user}, {thought:this.user}]).exec((err) => {
        if(err){
            logger.error(`LikeSchema.pre('save') Failed to delete dislike. ${err}`);

            throw new Error('Failed to delete dislike with same credentials');
        }
    })

    logger.info(`LikeSchema.pre('save') successfully called.`);
})

DislikeSchema.pre('save', function() {

    const Likes = mongoose.model('Likes', LikeSchema);

    // Delete a like if one exists with the same user and thought to ensure a user can't like and dislike a thought
    Likes.deleteOne().and([{user: this.user}, {thought:this.user}]).exec((err) => {
        if(err){
            logger.error(`DislikeSchema.pre('save') Failed to delete like. ${err}`);

            throw new Error('Failed to like dislike with same credentials');
        }
    })

    logger.info(`DislikeSchema.pre('save') successfully called.`);
})

