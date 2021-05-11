import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { MessageSchema } from '../models/messageModel';

const Message = mongoose.model('Message', MessageSchema)

export const getMessages = (req, res) => {

    const sentTo = req.body.sentTo;
    const sentFrom = req.body.sentFrom;

    const query = sentTo ? {sentTo} : sentFrom ? {sentFrom} : null;

    if(!query){
        logger.error(`getMessages() No data was sent with the response.`)
        return res.status(400).json({error: "Failed to get messages"})
    }

    Message.find(query)
        .populate(sentTo ? 'sentFrom' : 'sentTo')
        .then((messages) => {
            return res.json(messages);
        })
        .catch(err => {
            logger.error(`getMessages() Failed to get messages. ${err}`)
            return res.status(400).json({error: "Failed to get messages"})
        })
}

export const addMessage = (req, res) => {

    const message = req.body.message;

    const newMessage = new Message(req.body.message);
    newMessage.save()
        .then(message => {
            return res.json(message);
        })
        .catch(err => {
            logger.error(`addMessage() Failed to add message. ${err}`)
            return res.status(400).json({error: "Failed to add message"})
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
        .then(message => {
            return res.json(message);
        })
        .catch(err => {
            logger.error(`updateMessage() Failed to update message. ${err}`)
            return res.status(400).json({error: "Failed to update message"})
        })
}

export const deleteMessage = (req, res) => {

    const message = req.body.message;

    if(!message){
        logger.error(`deleteMessage() No data was sent with the response.`)
        return res.status(400).json({error: "Failed to delete message"})
    }

    Message.findByIdAndDelete(message._id)
    .then(() => {
        return res.status(204).send();
    })
    .catch(err => {
        logger.error(`deleteMessage() Failed to delete message. ${err}`)
        return res.status(400).json({error: "Failed to delete message"})
    })
}