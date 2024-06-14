const { default: mongoose, Schema } = require("mongoose");

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    },

})

const User = mongoose.model('user',UserSchema)
module.exports = mongoose.model('user', UserSchema)