const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String, 
        required : true,

    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    firstSignUp: {
        type: Date,
        default: Date.now()
    },
    loginStamps: [{
        type: Date,
        default: Date.now()
    }],
    hostingDetails : {
        isHost: { type: Boolean, default : false },
        startDate : { type: Date }
    },
    profile: {
        joined: { type: Date, default: Date.now() },
        image: String,
        email: String,
        fullName: String
    },
    banned : {
        type: Boolean,
        default: false
    }
}, { timestamps: true});

module.exports = mongoose.model("User", userSchema);