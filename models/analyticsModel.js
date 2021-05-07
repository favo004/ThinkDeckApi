import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const LikeSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    thoughtId:{
        type: Schema.Types.ObjectId, ref: 'Thought'
    }
})

export const DislikeSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    thoughtId:{
        type: Schema.Types.ObjectId, ref: 'Thought'
    }
})

export const HighlightSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    thoughtId:{
        type: Schema.Types.ObjectId, ref: 'Thought'
    }
})