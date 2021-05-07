import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MessageSchema = new Schema({
    sentTo: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    sentFrom: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    message: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    editedDate: {
        type: Date
    }
})