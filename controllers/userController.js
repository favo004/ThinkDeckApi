import mongoose from 'mongoose';
import fs from 'fs';
import shortid from 'shortid';
import { encrpytPassword, comparePassword, createToken } from './authController';

import { UserSchema } from '../models/userModel';
import { logger } from '../utils/logger';
import { GetUserPostErrorMessage, imageFilter } from '../utils/helpers';

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

    // Encrypt new password if exists
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

export const deleteUser = async (req, res) => {

    // Find if user exists before attempting to delete
    const exists = await User.findOne({_id: req.body.user?._id});
    
    if(!exists){
        logger.error(`deleteUser() User doesn't exist at id ${req.body.user?._id}`);
        return res.status(400).json({error: "User not found"});
    }

    // Delete user by id
    User.findByIdAndDelete(req.body.user?._id).exec((err) => {
        if(err){
            // Logging
            logger.error(`deleteUser() Failed to delete user with id ${req.body.user?.id}. Error message: ${err.message}`)

            return res.status(400).json({error: "Failed to delete user"});
        }

        return res.status(204).send();
    })
}

export const login = async (req, res) => {

    const user = req.body.user;
    // Check if user data was sent with the request
    if(!user){
        logger.error(`login() No user data was sent to the server.`);
        return res.status(400).json({error: "No data was sent to the server"});
    }

    // Check if username was sent with the request
    if(!user.username){
        logger.error(`login() No username was sent to the server.`);
        return res.status(400).json({error: "Username is required for login"});
    }

    // Check if password was sent with the request
    if(!user.password){
        logger.error(`login() No password was sent to the server.`);
        return res.status(400).json({error: "Password is required for login"});
    }

    // Check if user exists in the db
    const found = await User.findOne({username: new RegExp('\\b' + user.username + '\\b', 'i')}).exec();
    if(!found){
        logger.error(`login() Username was not found in db for username ${user.username}`);
        return res.status(400).json({error: "Username does not exist"});
    }

    // Check if passwords match
    if(!comparePassword(user.password, found.password)){
        return res.status(400).json({error: "Password does not match"});
    }

    //Login successful, return new token
    const token = createToken({_id: found._id, username: found.username, email: found.email});
    return res.status(200).json({token: token});
}

export const uploadUserImage = async (req, res) => {

    if(!req.files){
        logger.error(`uploadUserImage() No file was uploaded to server.`)
        return res.status(400).json({error: "No file was uploaded"})
    }

    const file = !req.files.imageUrl ? req.files.themeUrl : req.files.imageUrl;

    if(!file){
        logger.error(`uploadUserImage() No image was uploaded to server.`)
        return res.status(400).json({error: "No image was uploaded"})
    }

    // Check if file is an image
    if(!imageFilter(file.name)){
        logger.error(`uploadUserImage() Invalid file format. ${file.name}`)
        return res.status(400).json({error: "File uploaded was not an image."})
    }

    // Get user data
    const user = await User.findOne({_id: req.authorizedUser._id}).exec();
    if(!user){
        logger.error(`uploadUserImage() Could not get user data. ${err}`);
        return res.status(400).json({error: "Error uploading image."})
    }

    const basePath = './uploads/';
    const filePath = shortid.generate() + '.' + file.name.split('.').pop();

    // Make uploads directory if it doesn't exist
    if(!fs.existsSync(basePath)){
        fs.mkdirSync(basePath);
    }

    // Save upload
    file.mv(basePath + filePath, (err) => {
        if(err){
            logger.error(`uploadUserImage() Failed to upload new image for user ${user._id}. ${err}`);
            return res.status(400).json({error: "Error uploading image."})
        }

        // Update user image
        if(req.files.imageUrl){
            if(user.imageUrl){
                const existingPath = basePath + user.imageUrl;
                fs.unlink(existingPath, (err) => {
                    if(err){
                        logger.error(`uploadUserImage() Error deleting existing userImage from ${user._id}. ${err}`)
                    }
                })
            }

            user.imageUrl = filePath;
            console.log(user)
            user.save((err) => {
                if (err) {
                    logger.error(`uploadUserImage() Failed to save userImage to user data. ${err}`);
                    return res.status(400).json({error: "Failed to upload image."})
                }

                return res.status(204).send();
            })

        }

        // Update user theme
        if(req.files.themeUrl){
            if(user.themeUrl){
                const existingPath = basePath + user.themeUrl;
                fs.unlink(existingPath, (err) => {
                    if(err){
                        logger.error(`uploadUserImage() Error deleting existing userTheme from ${user._id}. ${err}`)
                    }
                })
            }

            user.themeUrl = filePath;
            user.save((err) => {
                if (err) {
                    logger.error(`uploadUserImage() Failed to save userImage to user data. ${err}`);
                    return res.status(400).json({error: "Failed to upload image."})
                }

                return res.status(204).send();
            })
        }

        


    })
}