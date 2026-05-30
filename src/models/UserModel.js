const mongoose = require("mongoose")
const Schema = mongoose.Schema
const objectId = Schema.ObjectId

const UserSchema = new Schema({
    id:objectId,
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    },
    theme:{
        type: String,
        default: "auto"
    }
})
const User = mongoose.model("User", UserSchema)
module.exports = User




