import mongoose from 'mongoose';

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

