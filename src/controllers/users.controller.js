import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import wrapper from "../utils/asyncHandler.js";

const signUp=wrapper((req,res)=>{
res.render("./user/signup")
})

const registered=wrapper(async (req,res)=>{
    try {
        const {username,password,email}=req.body
        if(!(username&&password&&email)){
            throw new apiError(401,"registeration enteries fetch failed")
        }
        const user=new User({
            username,
            email
        })
        const RegUser=await User.register(user,password)//the register method is provided by passport-local and adds the fields "salt" and "hash"
        if(!RegUser){
            throw new apiError(403,"User registeration failed!")
        }
        req.login(RegUser,(err)=>{
            if(err){
                throw new apiError(403,"User login failed")
            }else{
                req.flash("success","User registered and logged in successfully")
                res.redirect("/listing")  
            }
        })
    
    } catch (error) {
        req.flash("error",error.message)
        res.redirect(`/user/signup`)
    }

})

const login=wrapper( (req,res)=>{
    res.render("./user/login")
})

const loggingIn=wrapper(async (req,res)=>{
    req.flash("success","You have successfully logged in to WanderLust")
    const redirectUrl=res.locals.redirectUrl||"/listing"
    res.redirect(redirectUrl)
})


const logout=wrapper((req,res)=>{
    req.logout((err)=>{
        if(err){
            throw new apiError(403,"User failed to logout!")
        }
        req.flash("success","User logged out successfully!")
        res.redirect(`/listing`)
    }
)
})



const pageNotFound=wrapper((req,res)=>{
    throw new apiError(404,"Page not found")
})

export {
    signUp,
    registered,
    pageNotFound,
    login,
    loggingIn,
    logout
}