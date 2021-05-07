import mongoose from 'mongoose';
import { ThoughtSchema } from '../models/thoughtModel';
import { logger } from '../utils/logger';

const Thought = mongoose.model('Thought', ThoughtSchema);

// Returns all thoughts from an author or comments to a thought
export const getThoughts = async (req, res) => {

    const limit = req.body.limit;
    const page = req.body.page;

    // If user id was passed to request we will get the thoughts by the author
    // Otherwise we check to see if a thoughtId was passed in which we will get the comments
    // attached to the 
    const query = req.body.userId ? 
        {userId: req.body.userId} : 
        req.body.thoughtId ?
        {thoughtId: req.body.thoughtId} :
        undefined;

    if(!query)
    {
        logger.error(`No query Id was sent to request for thoughts in getThoughtsByUserId.`)
        return res.status(400).json({error: 'No query data was sent to the server'});
    }

    Thought.find(query)
        .skip(page * limit)
        .limit(limit)
        .exec((err, thoughts) => {
            if(err){

                // Logging
                logger.error(`Failed to get thoughts from getThoughtsByUserId. ${err}`)

                return res.status(400).json({error: 'Error getting thoughts'});
            }

            return res.json(thoughts);
        })
}

// Returns thought by param id
export const getThoughtById = async (req, res) => {

    const id = req.param.id;

    if(!id){
        logger.error(`No id was sent to request for getThoughtById`);
        return res.status(400).json({error: `Error getting thought`})
    }

    Thought.findById({_id: id})
        .exec((err, thought) => {
            if(err){

                // Logging
                logger.error(`Failed to get thought with id ${id} from getThoughtById. ${err}`)

                return res.status(400).json({error: 'Error getting thought'});
            }

            return res.json(thought);
        })
}

// Add new thought
export const addThought = async (req, res) => {

    
}

