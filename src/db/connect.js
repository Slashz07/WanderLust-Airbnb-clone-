import mongoose from "mongoose";
import { db_name } from "../constants.js";

const dbConnect=async ()=>{
    try {
        const connObj=await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
        console.log(`Connected to database at host: ${connObj.connection.host}`)
    } catch (error) {
        console.log(`db connection error: ${error}`)
    }

}

export {dbConnect}