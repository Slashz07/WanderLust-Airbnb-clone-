import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose)//this plugin automatically creates a username and hash and salt fields in schema

export const User=mongoose.model("User",userSchema)