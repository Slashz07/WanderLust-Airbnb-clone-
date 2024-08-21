import dotenv from "dotenv"
if(process.env.NODE_ENV!="production")
{
dotenv.config({
    path:"./.env"
})}

import express from "express"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import reviewsRouter from "./routes/reviews.route.js"
import path from "path"
import { fileURLToPath } from 'url';
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import session from "express-session"
import flash from  "connect-flash"
import passport from "passport"
import localStrategy from "passport-local"
import { User } from "./models/user.model.js"
import MongoStore from "connect-mongo"

const store=MongoStore.create({
    mongoUrl:process.env.MONGODB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600//storage is in seconds,after this much time it will update the session store in mongo-connect,until then even if user refreshes page again and again,session wont be updated unnecessarily,it would either update if user interacts with server or after a day(24 hrs)
})

store.on("error",()=>{
    console.log("error in mongo store",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookies:{
        expires:Date.now()+7 * 24 * 60 * 60 * 1000,
        maxAge:   7 * 24 * 60 * 60 * 1000,
        httpOnly:true 
    }   
}


let __filename = fileURLToPath(import.meta.url);
let  __dirname = path.dirname(__filename);

const app=express()

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public"))) 
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())//this ensures that for every request ,the passport is initialised once.Since passport needs session to ensure login request is not  made again while the session is active ,session should always be created before it, as done above 

app.use(passport.session())// it integrates Passport.js with Express sessions, allowing users to stay logged in across multiple requests.
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(methodOverride("_method"))

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.loggedUser=req.user
    next()
})


app.use("/user",userRouter)
app.use("/listing/:id/reviews",reviewsRouter)
app.use("/listing",listingRouter)
app.use("/",(req,res)=>{
    res.redirect("/listing")
})


app.use((req,res)=>{
    res.render("error",{Error:"Page not found!"})
})

export default app