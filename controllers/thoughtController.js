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
    // attached to the thought
    const query = req.body.user ? 
        {user: req.body.user} : 
        req.body.commentTo ?
        {commentTo: req.body.commentTo} :
        undefined;

    if(!query)
    {
        logger.error(`No query Id was sent to request for thoughts in getThoughtsByUserId.`)
        return res.status(400).json({error: 'No query data was sent to the server'});
    }

    Thought.find()
        .where(query)
        .skip(page * limit)
        .limit(limit)
        .exec((err, thoughts) => {
            if(err){

                // Logging
                logger.error(`getThoughtsByUserId Failed to get thoughts - ${err}`)

                return res
                    .status(400)
                    .json({error: 'Error getting thoughts'});
            }

            return res.json(thoughts);
        })
}

// Returns thought by param id
export const getThoughtById = async (req, res) => {

    const id = req.params.id

    if(!id){
        logger.error(`No id was sent to request for getThoughtById`);
        return res.status(400).json({error: `Error getting thought`})
    }

    Thought.findById({_id: id})
        .exec((err, thought) => {
            if(err){

                // Logging
                logger.error(`getThoughtById Failed to get thought with id ${id} - ${err}`)

                return res
                    .status(400)
                    .json({error: 'Error getting thought'});
            }

            return res.json(thought);
        })
}

// Add new thought
export const addThought = async (req, res) => {

    // Check for duplicate thought
    const duplicate = await Thought.findOne()
            .and([{user: req.body.thought.user}, 
                {thought: req.body.thought.thoughtBody},
                {commentTo: req.body.thought.commentTo}])
            .exec();

    if(duplicate){
        logger.info(`addThought duplicate thought was attempted to be added. ${duplicate._id}`)
        return res.status(400).json({error: "Thought already exists"});
    }

    // Create new thought
    const newThought = new Thought(req.body.thought);

    // Save new user to db
    newThought.save((err, user) => {
        if(err){
            // Logging
            logger.error(`Failed to create thought. ${err}`);

            return res
                .status(400)
                .json({error: `Failed to create thought.`})
        }

        // Logging
        logger.info(`Created user id:${user.id}`)

        // Remove password before sending data
        user.password = undefined;
        return res.json(user);
    })
}

// Update thought
export const updateThought = async (req, res) => {

    Thought.findByIdAndUpdate({_id: req.body.thought?._id}, req.body.thought)
        .setOptions({new: true})
        .exec((err, thought) => {
            if(err){
                // Logging
                logger.error(`updateThought Failed to update thought ${thought} - ${err}`)

                return res
                    .status(400)
                    .json({error: `Failed to update thought.`})
            }

            return res.json(thought);
        })
}

// Delete thought
export const deleteThought = async (req, res) => {

    const exists = await Thought.findOne({_id: req.body.thought?._id});

    if(!exists){
        logger.error(`deleteThought() Thought doesn't exist at id ${req.body.thought?._id}`);
        return res.status(400).json({error: "Thought not found"});
    }

    Thought.findOneAndDelete({_id: req.body.thought?._id})
        .exec((err) => {
            if(err){
                // Logging
                logger.error(`deleteThought() Failed to delete thought ${err}`)

                return res
                    .status(400)
                    .json({error: 'Failed to delete user'})
            }

            return res.status(204).send();
        })
}

