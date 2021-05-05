import express from 'express'

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3002;

app.listen(() => {
    console.log(`Listening on port ${port}`);
})
