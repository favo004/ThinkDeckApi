import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MessageSchema = new Schema({
    sentTo: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    sentFrom: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    messageBody: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    editedDate: {
        type: Date
    }
})

MessageSchema.pre('findOneAndUpdate', async function() {
    
    const doc = await this.model.findOne(this.getFilter());
    doc.editedDate = new Date();

    doc.save((err) => {
        if(err){
            logger.error(`MessageSchema.post('findOneAndUpdate') Error setting editedDate for message ${this.getFilter()}`);
        }
    })
})