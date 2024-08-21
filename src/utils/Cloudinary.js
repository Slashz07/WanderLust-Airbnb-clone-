import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import fs from 'fs'
import multer from "multer";
dotenv.config({
    path:"./.env"
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const uploadOnCloudinary=async (multerFileUrl)=>{

    try {
        if(!multerFileUrl){
            return null
        }

        const cloudResponse=await cloudinary.uploader.upload(multerFileUrl,{
            resource_type:"auto",
            folder:"WanderLust_DEV"
        })
        fs.unlinkSync(multerFileUrl)

        return cloudResponse

    } catch (error) {
        fs.unlinkSync(multerFileUrl)
        return null
    }

}

export {uploadOnCloudinary}