import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { LikeSchema, DislikeSchema, HighlightSchema } from '../models/analyticsModel';

const Likes = mongoose.model('Likes', LikeSchema);
const Dislikes = mongoose.model('Dislikes', DislikeSchema);
const Highlights = mongoose.model('Highlights', HighlightSchema);

export const getAnalytics = async (req, res) => {
    const getCounts = req.body.getCounts;

    const getLikes = req.body.getLikes;
    const getDislikes = req.body.getDislikes;
    const getHighlights = req.body.getHighlights;

    const thought = req.body.thought;

    if(!thought){
        logger.error(`getAnalytics() No thought was sent to request.`);

        return res.status(400).json({error: "Failed to get analytics for thought."})
    }

    try{
        const likes = await Likes.find().where({ thought: thought }).exec();
        const dislikes = await Dislikes.find().where({ thought: thought }).exec();
        const highlights = await Highlights.find().where({ thought: thought }).exec();
    } catch (err) {

        logger.error(`getAnalytics() Failed to query db for analytics. ${err}`);

        return res.status(400).json({error: "Failed to get analytics."})
    }

    if(getCounts){
        logger.info(`getAnalytics() Getting counts for analytics for thought ${thought._id}`);

        return res.json({likeCount: likes.length, dislikeCount: dislikes.length, highlightCount: highlights.length})
    }

    return res.json({likes, dislikes, highlights});
}

export const getLikes = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    const query = 
        thought ? {thought} :
        user ? {user} :
        null;

    if(!query){
        logger.error(`getLikes() No data was passed with the request.`)
        return res.status(400).json({error: 'Failed to get likes.'})
    }

    Likes.find()
        .where(query)
        .populate(thought ? 'user' : 'thought')
        .exec((err, likes) => {
            if(err){
                // Logging
                logger.error(`getLikes() Failed to get likes from db. ${err}`)
                return res.status(400).json({error: "Failed to get likes."})
            }

            return res.json(likes);
        })
}
export const getDislikes = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    const query = 
        thought ? {thought} :
        user ? {user} :
        null;

    if(!query){
        logger.error(`getDislikes() No data was passed with the request.`)
        return res.status(400).json({error: 'Failed to get dislikes.'})
    }

    Dislikes.find()
        .where(query)
        .populate(thought ? 'user' : 'thought')
        .exec((err, dislikes) => {
            if(err){
                // Logging
                logger.error(`getDislikes() Failed to get dislikes from db. ${err}`)
                return res.status(400).json({error: "Failed to get dislikes."})
            }

            return res.json(dislikes);
        })
}
export const getHighlights = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    const query = 
        thought ? {thought} :
        user ? {user} :
        null;

    if(!query){
        logger.error(`getDislikes() No data was passed with the request.`)
        return res.status(400).json({error: 'Failed to get highlights.'})
    }

    Highlights.find()
        .where(query)
        .populate(thought ? 'user' : 'thought')
        .exec((err, highlights) => {
            if(err){
                // Logging
                logger.error(`getHighlights() Failed to get highlights from db. ${err}`)
                return res.status(400).json({error: "Failed to get highlights."})
            }

            return res.json(highlights);
        })
}

export const addLike = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    if(!thought){
        logger.error(`addLike() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to add like.'})
    }

    if(!user){
        logger.error(`addLike() No user was passed with the request.`)
        return res.status(400).json({error: 'Failed to add like.'})
    }

    // Check for duplicate
    const duplicate = Likes.findOne().and([{thought}, {user}]).exec();
    if(duplicate){
        logger.error(`addLike() Like already exists for ${thought} ${user}`)
        return res.status(400).json({error: 'Like already exists.'})
    }

    const like = new Likes(req.body);
    like.save((err, like) => {
        if(err){
            logger.error(`addLike() Failed to add like to db. ${err}`)
            return res.status(400).json({error: 'Failed to add like.'})
        }

        return res.json(like);
    })

}

export const addDislike = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    if(!thought){
        logger.error(`addDislike() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to add dislike.'})
    }

    if(!user){
        logger.error(`addDislike() No user was passed with the request.`)
        return res.status(400).json({error: 'Failed to add dislike.'})
    }

    // Check for duplicate
    const duplicate = Dislikes.findOne().and([{thought}, {user}]).exec();
    if(duplicate){
        logger.error(`addDislike() Dislike already exists for ${thought} ${user}`)
        return res.status(400).json({error: 'Dislike already exists.'})
    }

    const dislike = new Dislikes(req.body);
    dislike.save((err, dislike) => {
        if(err){
            logger.error(`addLike() Failed to add dislike to db. ${err}`)
            return res.status(400).json({error: 'Failed to add dislike.'})
        }

        return res.json(dislike);
    })

}

export const addHighlight = (req, res) => {

    const thought = req.body.thought;
    const user = req.body.user;

    if(!thought){
        logger.error(`addDislike() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to add highlight.'})
    }

    if(!user){
        logger.error(`addDislike() No user was passed with the request.`)
        return res.status(400).json({error: 'Failed to add highlight.'})
    }

    // Check for duplicate
    const duplicate = Highlights.findOne().and([{thought}, {user}]).exec();
    if(duplicate){
        logger.error(`addHighlight() Highlights already exists for ${thought} ${user}`)
        return res.status(400).json({error: 'Highlights already exists.'})
    }

    const highlight = new Highlights(req.body);
    highlight.save((err, highlight) => {
        if(err){
            logger.error(`addLike() Failed to add highlight to db. ${err}`)
            return res.status(400).json({error: 'Failed to add highlight.'})
        }

        return res.json(highlight);
    })

}

export const removeLike = (req, res) => {

    const like = req.body.like;

    if(!like){
        logger.error(`removeLike() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to remove like.'})
    }

    Likes.findByIdAndDelete(like._id)
        .then((like) => {

            return res.json(like);
        })
        .catch(err => {
            logger.error(`removeLike() Failed to remove like to db. ${err}`)
            return res.status(400).json({error: 'Failed to remove like.'})
        })

}

export const removeDislike = (req, res) => {

    const dislike = req.body.dislike;

    if(!dislike){
        logger.error(`removeDislike() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to remove dislike.'})
    }

    Likes.findByIdAndDelete(dislike._id)
        .then((dislike) => {

            return res.json(dislike);
        })
        .catch(err => {
            logger.error(`removeDislike() Failed to remove dislike to db. ${err}`)
            return res.status(400).json({error: 'Failed to remove dislike.'})
        })

}

export const removeHighlight = (req, res) => {

    const highlight = req.body.highlight;

    if(!highlight){
        logger.error(`removeHighlight() No thought was passed with the request.`)
        return res.status(400).json({error: 'Failed to remove highlight.'})
    }

    Likes.findByIdAndDelete(highlight._id)
        .then((highlight) => {

            return res.json(highlight);
        })
        .catch(err => {
            logger.error(`removeHighlight() Failed to remove highlight to db. ${err}`)
            return res.status(400).json({error: 'Failed to remove highlight.'})
        })

}