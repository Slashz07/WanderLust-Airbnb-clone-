import { Listing } from "../models/listing.model.js"
import { Review } from "../models/reviews.model.js"

export const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","Please Log in first")
        res.redirect("/user/login")
    }else{
        next()
    }
}

export const saveRedirectUrl=(req,res,next)=>{
    res.locals.redirectUrl=req.session.redirectUrl
    next()
}

export const isOwner=async(req,res,next)=>{
    const {id}=req.params
    const listing =await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.loggedUser._id)){
       req.flash("error","You are not authorised to perform updation on this listing!")
       return res.redirect(`/listing/${id}`)
    }
    next()
}

export const isReviewAuthor=async(req,res,next)=>{
    const {id}=req.params
    const {reviewId}=req.params
    const review =await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.loggedUser._id)){
       req.flash("error","You are not authorised to delete this review!")
       return res.redirect(`/listing/${id}`)
    }
    next()
}