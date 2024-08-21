import app from "./src/app.js";
import dotenv from "dotenv"
import { dbConnect } from "./src/db/connect.js";

dotenv.config({
    path:"./.env"
})

dbConnect().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening at: http://localhost:${process.env.PORT}`)
    })
})

