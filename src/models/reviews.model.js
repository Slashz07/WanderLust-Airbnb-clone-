import mongoose,{Schema} from "mongoose"
import { User } from "./user.model.js"

const reviewSchema=new Schema({
comment:{
    type:String,
    required:[true,"enter a comment"]
},
rating:{
    type:Number,
    min:1,
    max:5,
    required:[true,"provide a rating"]
},
author:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
createdAt:{
    type:Date,
    default:Date.now()
}
})

export const Review=mongoose.model("Review",reviewSchema)