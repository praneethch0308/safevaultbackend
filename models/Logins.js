const mongoose = require("mongoose");
const { Schema } = mongoose;


const LoginSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    website:{
        type: String,
        required:true
    },
    url:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Logins', LoginSchema);