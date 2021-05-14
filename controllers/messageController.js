import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { MessageSchema } from '../models/messageModel';

const Message = mongoose.model('Message', MessageSchema)

export const getMessages = (req, res) => {

    const sentTo = req.body.sentTo;
    const sentFrom = req.body.sentFrom;

    const query = sentTo ? {sentTo: sentTo} : sentFrom ? {sentFrom: sentFrom} : null;

    if(!query){
        logger.error(`getMessages() No data was sent with the response.`)
        return res.status(400).json({error: "Failed to get messages"})
    }

    Message.find(query)
        .populate(sentTo ? 'sentFrom' : 'sentTo')
        .exec((err, messages) => {
            if(err){
                logger.error(`getMessages() Failed to get messages. ${err}`)
                return res.status(400).json({error: "Failed to get messages"})
            }

            return res.json(messages);
        })      
}

export const addMessage = async (req, res) => {

    const newMessage = new Message(req.body.message);
    newMessage.save((err, message) => {
        if(err){
            logger.error(`addMessage() Failed to add message. ${err}`)
            return res.status(400).json({error: "Failed to add message"})
        }

        return res.json(message);
    })
}

export const updateMessage = (req, res) => {

    const message = req.body.message;

    if(!message){
        logger.error(`updateMessage() No data was sent with the response.`)
        return res.status(400).json({error: "Failed to update message"})
    }

    Message.findByIdAndUpdate(
        message._id, 
        message)
        .setOptions({new:true})
        .exec((err, message) => {
            if(err){
                logger.error(`updateMessage() Failed to update message. ${err}`)
                return res.status(400).json({error: "Failed to update message"})
            }
            
            return res.json(message);
        })
}

export const deleteMessage = (req, res) => {
    
    if(!req.body.message){
        logger.error(`deleteMessage() No data was sent with the response.`)
        return res.status(400).json({error: "Failed to delete message"})
    }
    
    Message.findByIdAndDelete({_id: req.body.message._id}).exec(err => {
        if(err){
            logger.error(`deleteMessage() Failed to delete message. ${err}`)
            return res.status(400).json({error: "Failed to delete message"})
        }
        
        return res.status(204).send();
    })

}