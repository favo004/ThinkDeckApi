import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const FollowSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    follow: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    createdDate:{
        type: Date,
        default: Date.now
    }
})