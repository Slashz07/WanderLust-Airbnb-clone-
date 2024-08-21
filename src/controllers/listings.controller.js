import wrapper from "../utils/asyncHandler.js";
import {Listing} from "../models/listing.model.js"
import {apiError} from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { v2 as Cloudinary } from "cloudinary";
import mapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding-v6.js"
const mapBoxToken=process.env.MAP_TOKEN
const geoCodeClient=mapboxGeocoding({accessToken:mapBoxToken})

const getAllListing=wrapper(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render(`./listing/index.ejs`,{props:allListings})
})

const searchListings = wrapper(async (req, res) => {
    const { search } = req.body;
    const trimmedSearch = search.trim();
    const listingsBySearch = await Listing.find({
        country: { $regex: new RegExp(trimmedSearch, 'i') }
    });

    if (listingsBySearch.length === 0) {
        req.flash("error", `We do not have any AirBnbs in ${trimmedSearch}`);
        return res.redirect("/listing");
    }else{
        res.render("./listing/index", { props: listingsBySearch });
    }

});

const getCategorisedListings=wrapper(async(req,res)=>{
    const {type}=req.params
    const categorisedListings=await Listing.find({category:type})
    if(!categorisedListings.length){
        req.flash("success",`No Current listing is categorised in ${type}`)
        res.redirect(`/listing`)
    }else{
        res.render(`./listing/index.ejs`,{props:categorisedListings})
    }
})

const createNewProp=wrapper(async (req,res)=>{
    res.render("./listing/new.ejs")
})

const saveNewProp=wrapper(async (req,res)=>{
    let {title,description,image,price,category,location,country}=req.body
    const numPrice= typeof(price)=="string"? price.replace(',', ''):price
    const owner=req.user._id
    const multerFileUrl=req.file?.path

    let response=await geoCodeClient.forwardGeocode(
        {
            query:location,
            limit:1
        }
    ).send()

    const geometry=response.body.features[0].geometry//features is an array of objects where each object contains info about the nearby coordnates to location provided by user depending on the limit set 

    if(!multerFileUrl){
        throw new apiError(500,"multer failed to store files locally")
    }

    const cloudRes=await uploadOnCloudinary(multerFileUrl)
    if(!cloudRes.url){
        throw new apiError(500,"file upload to cloudinary failed")
    }

    image=cloudRes?.url

    const newProp=await Listing.create({
        title,
        image:{
            filename:cloudRes.public_id,
            url:image
        },
        description,
        price:numPrice,
        location,
        owner,
        category,
        geometry,
        country
    })
    if(newProp){
        req.flash("success","New Listing created")
        res.redirect("/listing")
    }else{
        throw new apiError(401,"New listing could not be created")
    }
})

const editProp=wrapper(async (req,res)=>{
    const {id}=req.params
    const propInfo=await Listing.findById(id)
    if(!propInfo){
        req.flash("error","No such Property listing exists")
        res.redirect("/listing")
    }else{
        const originalUrl=propInfo.image.url
        const imgPreview=originalUrl.replace("/upload","/upload/w_250")
        res.render("./listing/edit.ejs",{propInfo:propInfo,imgPreview})
    }
})

const saveUpdates=wrapper(async (req,res)=>{
    let {title,description,price,category,location,country}=req.body
    const {id}=req.params
    const numPrice= typeof(price)=="string"? price.replace(',', ''):price
    const post=await Listing.findById(id)
    const oldImagePublicId=post.image.filename
    
    let response=await geoCodeClient.forwardGeocode(
        {
            query:location,
            limit:1
        }
    ).send()

    const geometry=response.body.features[0].geometry//features is an array of objects where each object contains info about the nearby coordnates to location provided by user depending on the limit set 

    if(typeof (req.file)=="undefined"){
        
    const updatedListing= await Listing.findByIdAndUpdate(
        id,
        {
            $set:{
                title,
                description,
                price:numPrice,
                location,
                category,
                geometry,
                country
            }
        },
        {
            new:true
        }
    )
    if(updatedListing){
        console.log("property details updated successully")
    console.log(updatedListing)

        req.flash("success","Listing Updated Successfully")
        res.redirect(`/listing/${id}`)
    }

    }else{
        const multerFileLink=req.file?.path
    
        if(!multerFileLink){
            throw new apiError(500,"multer failed to store image")
        }
    
        const cloudRes=await uploadOnCloudinary(multerFileLink)
        
        if(!cloudRes.url){
            throw new apiError(500,"Cloudinary failed  to upload image")
        }
    
        const updatedListing= await Listing.findByIdAndUpdate(
            id,
            {
                $set:{
                    title,
                    image:{
                        filename:cloudRes.public_id,
                        url:cloudRes.url
                    },
                    description,
                    price:numPrice,
                    location,
                    category,
                    geometry,
                    country
                }
            },
            {
                new:true
            }
        )
        if(updatedListing){
            console.log("property details updated successully")
            await Cloudinary.uploader.destroy(oldImagePublicId, {
                resource_type: "image"//Must be one of: image, javascript, css, video, raw
            })
                 
            req.flash("success","Listing Updated Successfully")
            res.redirect(`/listing/${id}`)
        }
    }
   
})


const getListingInfo=wrapper(async(req,res)=>{
    const {id}=req.params
    const propertyInfo=await Listing.findById(id).
    populate({path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner")
    if(propertyInfo){
        res.render("./listing/show.ejs",{infoObj:propertyInfo})
    }else{
        req.flash("error","No such Property listing exists")
        res.redirect("/listing")
    }
})


const deleteProp=wrapper(async (req,res)=>{
    const {id}=req.params
    const deletedProp=await Listing.findByIdAndDelete(id)
    if(deletedProp){
        console.log(`Prop of id:${id} deleted successfully`)
        req.flash("success","Listing Deleted Successfully")
        res.redirect("/listing")
    }
})



const pageNotFound=wrapper((req,res)=>{
    throw new apiError(404,"Page not found")
})

export {
    getAllListing,
    getListingInfo,
    createNewProp,
    saveNewProp,
    editProp,
    saveUpdates,
    deleteProp,
    pageNotFound,
    getCategorisedListings,
    searchListings
}