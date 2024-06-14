const mongoose = require('mongoose')
require('dotenv').config()
const mongoURL = process.env.MONGO_URL;

const connectToMongo = () =>{
    mongoose.connect(mongoURL).then(()=>console.log("Connected")).catch((e)=>console.log(e.message))
}

module.exports = connectToMongo