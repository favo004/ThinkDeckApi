import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const encrpytPassword = (password) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = (passwordToCompare, password) => {
    return bcrypt.compareSync(passwordToCompare, password);
}

export const createToken = (user) => {

    const jwtOptions = {
        expiresIn: 86400 // 24 hours
    }

    return `Bearer ` + jwt.sign(
            user, 
            process.env.JWTSECRET, 
            jwtOptions)
}

export const verifyToken = (req, res, next) => {

    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        jwt.verify(
            req.headers.authorization.split(' ')[1], 
            process.env.JWTSECRET, 
            (err, decoded) => {
                if(err){
                    //Unauthorized
                    logger.error(`verifyToken() Error verifying token ${err}`)
                    return res.status(403).json({error:"Unauthorized"})
                }
                else{
                    next();
                }
            })
    }
    else{
        //Unauthorized
        logger.error(`verifyToken() No auth token sent with request ${req.url}`)
        return res.status(403).json({error:"Unauthorized"})
    }
}