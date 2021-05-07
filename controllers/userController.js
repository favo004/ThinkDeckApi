import mongoose from 'mongoose';
import { encrpytPassword } from './authController';

import { UserSchema } from '../models/userModel';
import { logger } from '../utils/logger';
import { GetUserPostErrorMessage } from '../utils/helpers';

const User = mongoose.model('User', UserSchema);

export const getUsers = (req, res) => {
    // Gets all users

    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    User.find({})
        .select({password: 0})
        .skip(page*limit)
        .limit(limit)
        .exec((err, users) => {
            if(err){
                // Logging
                logger.error(`Failed to get users: ${req.params.id}`);
    
               return res.json({error: "Failed to get users"});
            }
    
            return res.json(users)
        })
}

export const getUserById = (req, res) => {

    // Find user with id from url param

    User.findOne({_id: req.params.id})
        .select({password: 0})
        .exec((err, user) => {
            if(err){
                // Logging
                logger.error(`Failed to get user with id: ${req.params.id}`)

                return res.json({error: "Failed to get user"})
            }

            return res.json(user);
        })
}

export const createNewUser = async (req, res) => {

    // Create new user
    const newUser = new User(req.body.user);

    // Encrypt password before storing in db
    newUser.password = await encrpytPassword(req.body.user.password);

    // Save new user to db
    newUser.save((err, user) => {
        if(err){
            // Logging
            logger.error(`Failed to create user. ${err}`);
            let errMessage = "Failed to create user";

            if(err.name === "ValidationError"){
                errMessage = GetUserPostErrorMessage(err);
            }

            return res
                .status(400)
                .json({error: `${errMessage}`})
        }

        // Logging
        logger.info(`Created user id:${user.id}`)

        // Remove password before sending data
        user.password = undefined;
        return res.json(user);
    })
}

export const updateUser = async (req, res) => {

    // If new password exists we exncrypt it before saving
    if(req.body.user?.password){
        req.body.user.password = await encrpytPassword(req.body.user.password);
    }

    // Update user by id

    User.findByIdAndUpdate(req.body.user?._id, req.body.user)
        .setOptions({new:true})
        .select({password: 0})
        .exec((err, user) => {
            if(err){
                // Logging
                logger.error(`Failed to update user with id ${req.body.user._id}. Error message: ${err.message}`)

                return res
                    .status(400)
                    .json({error:"Failed to update user"})
            }
            if(!user){
                return res.status(400).json({error: "Invalid user data."})
            }
            return res.json(user);
        })
}

export const deleteUser = (req, res) => {

    // Delete user by id
    User.findByIdAndDelete(req.body.user._id, (err) => {
        if(err){
            // Logging
            logger.error(`Failed to delete user with id ${req.body.user.id}. Error message: ${err.message}`)

            return res.status(400).json({error: "Failed to delete user"});
        }

        return res.status(204).send();
    })
}