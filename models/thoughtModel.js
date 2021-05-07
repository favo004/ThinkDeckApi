import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ThoughtSchema = new Schema({
    thoughtId: {
        type: Schema.Types.ObjectId, ref: 'Thought'
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    thought: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    editedDate:{
        type: Date
    }
})