import mongoose from 'mongoose';
import { FollowSchema } from '../models/followModel';
import { logger } from '../utils/logger';

const Follow = mongoose.model('Follow', FollowSchema);

export const getFollows = async (req, res) => {

    const limit = req.body.limit
    const page = req.body.page;

    // If user is passed with the request we will get the follows otherwise
    // we will get the user attached to the follow
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

    Follow.findByIdAndDelete(req.body.follow?._id)
        .exec((err) => {
            if(err){
                // Logging
                logger.error(`deleteFollow() Failed to delete follow. ${err}`);

                return res.status(400).json({error: "Failed to delete follow."})
            }

            return res.status(204).send();
        })
}