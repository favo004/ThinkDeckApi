import mongoose from 'mongoose';
import { FollowSchema } from '../models/followModel';
import { logger } from '../utils/logger';

const Follow = mongoose.model('Follow', FollowSchema);

export const getFollows = async (req, res) => {

    const limit = req.body.limit
    const page = req.body.page;

    // If user is passed with the request we will get the follows otherwise
    // we will get followers
    const query = req.body.user ? {user: req.body.user} :
                  req.body.follow ? {follow: req.body.follow} :
                  null;

    if(!query){
        logger.error(`GetFollows() no user or follow was sent to server.`);
        return res.status(400).json({error: 'Failed to get follows for user.'})
    }

    Follow.find()
        .where(query)
        .skip(page*limit)
        .limit(limit)
        .populate(req.body.user ? 'user' : 'follow')
        .exec((err, follows) => {
            if(err){
                // Logging
                logger.error(`GetFollows() Failed to get follows from db. ${err}`);

                return res
                    .status(400)
                    .json({error: 'Failed to get follows for user.'})
            }

            return res.json(follows);
        })
}

export const addFollow = async (req, res) => {

    // Check for self follow
    if(req.body.follow?.user._id === req.body.follow?.follow._id){
        logger.info(`addFollow() User and follow were the same. ${req.body.follow?._id}`)
        return res.status(400).json({error: "User and follow need to be different"});
    }

    // Check for duplicate follow
    const duplicate = await Follow.findOne()
        .and([{user: req.body.follow?.user}, 
              {follow: req.body.follow?.follow}])
        .exec();

    if(duplicate){
        logger.info(`addFollow() duplicate follow was attempted to be added. ${duplicate._id}`)
        return res.status(400).json({error: "Follow already exists"});
    }

    const follow = new Follow(req.body.follow);

    follow.save((err, follow) => {
        if(err){
            // Logging
            logger.error(`addFollow() Failed to add new follow. ${err}`)

            return res.status(400).json({error: "Failed to add follow."})
        }

        return res.json(follow);
    })
}

export const deleteFollow = async (req, res) => {


    Follow.findByIdAndDelete({_id: req.body.follow?._id })
        .exec((err) => {
            if(err){
                // Logging
                logger.error(`deleteFollow() Failed to delete follow. ${err}`);

                return res.status(400).json({error: "Failed to delete follow."})
            }

            return res.status(204).send();
        })
}