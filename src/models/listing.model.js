import mongoose, { mongo, Schema, set } from "mongoose";
import { Review } from "./reviews.model.js";
import { apiError } from "../utils/apiError.js";
import { User } from "./user.model.js";

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
            filename: {
              type: String,
              default:"listingimage",
              required: true,
            },
            url: {
              type: String,
              default:"https://images.vector-images.com/clp2/257224/clp3899588.jpg",
              set:(img)=>img==="" ? "https://images.vector-images.com/clp2/257224/clp3899588.jpg":img,
              required:true
            }  
    },
    price:{
        type:Number,
        min:[10,"Please charge an appropriate price"],
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    geometry:{
        type:{//type is here one of the subfields of geometry,the geometry object we assign this field also contains the 2 fields of type and coordinates where type field is "Point"  and coordinates is an  array of coordinates
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum:["rooms","iconicCities","mountains","castles","pools","camping","beach","boats","tropical","arctic"]
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(!listing){
        throw new apiError("listing deletion failed,could not delete its reviews")
    }
    await Review.deleteMany({_id:{$in:listing.reviews}})
})

export const Listing =mongoose.model("Listing",listingSchema)