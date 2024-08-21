import wrapper from "../utils/asyncHandler.js";
import {Listing} from "../models/listing.model.js"
import {Review} from "../models/reviews.model.js"
import {apiError} from "../utils/apiError.js"



const createReviews=wrapper(async(req,res)=>{
    const {id}=req.params
    const {rating,comment}=req.body
    const review=await Review.create({
        rating,
        comment,
        author:res.locals.loggedUser
    })
    if(!review){
        throw new apiError(402,"review creation failed")
    }
    const isUpdated=await Listing.findByIdAndUpdate(
        id,
        {
            $push:{
                reviews:review
            }
        },
        {
            new:true
        }
    )
    if(!isUpdated){
        throw new apiError(401,"Review updation in listing failed")
    }

    req.flash("success","Review Added Successfully")
    res.redirect(`/listing/${id}`)

})

const deleteReview=wrapper(async(req,res)=>{
    const{id,reviewId}=req.params
    const isDeleted=await Review.findByIdAndDelete(reviewId)
    if(!isDeleted){
        throw new apiError(400,"review deletion failed at review model!")
    }
    const reviewDel=await Listing.findByIdAndUpdate(
        id,
        {
            $pull:{
                reviews:reviewId
            }
        },
        {
            new:true
        }
    )
    if(!reviewDel){
        throw new apiError(400,"review deletion failed at listing")
    }
    req.flash("success","Review Deleted Successfully")
    res.redirect(`/listing/${id}`)
})




const pageNotFound=wrapper((req,res)=>{
    throw new apiError(404,"Page not found")
})

export {
    createReviews,
    deleteReview,
    pageNotFound
}