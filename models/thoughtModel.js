import mongoose from 'mongoose';
import { logger } from '../utils/logger';

import { LikeSchema, DislikeSchema, HighlightSchema } from './analyticsModel'

const Schema = mongoose.Schema;

const Likes = mongoose.model('Likes', LikeSchema);
const Dislikes = mongoose.model('Dislikes', DislikeSchema);
const Highlights = mongoose.model('Highlights', HighlightSchema);

export const ThoughtSchema = new Schema({
    commentTo: {
        type: Schema.Types.ObjectId, ref: 'Thought'
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    thought: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    editedDate:{
        type: Date,
        default: null
    }
})

ThoughtSchema.post('findOneAndUpdate', async function() {

    const doc = await this.model.findOne(this.getFilter());
    doc.editedDate = new Date();
    console.log(doc)
    doc.save((err) => {
        if(err){
            logger.error(`ThoughtSchema.post('findOneAndUpdate') Error setting editedDate for thought ${this.getFilter()}`);
        }
    })
})

ThoughtSchema.pre('findOneAndDelete', async function() {
    await Likes.deleteMany({thoughtId: this._id}).exec();
    await Dislikes.deleteMany({thoughtId: this._id}).exec();
    await Highlights.deleteMany({thoughtId: this._id}).exec();

    // Logging
    logger.info(`ThoughtSchema pre removed likes, dislikes, and highlights from deleted thought ${this._id}`)
})