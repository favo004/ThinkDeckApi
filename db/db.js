import mongoose from 'mongoose';
import { logger } from '../utils/logger'

export const connectDb = async () => {
    // Mongoose connection
    mongoose.Promise = global.Promise;
        
    mongoose.connection.on('error', (err) => {
        logger.error(`DB Error: ${err.message}`)
    })
    mongoose.connection.on('connected', () => {
        console.log('Connected to DB!')
    })

    const db = await mongoose.connect(process.env.DBURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
        })

    return db.connection;
}