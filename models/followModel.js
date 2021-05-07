import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const FollowSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    followId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    createdDate:{
        type: Date,
        default: Date.now
    }
})