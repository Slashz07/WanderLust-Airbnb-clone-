import {Router} from "express"
import { isOwner, isLoggedIn } from "../middlewares/login.js"
import { getAllListing,
         getListingInfo,
         createNewProp,
         saveNewProp,
         editProp,
         saveUpdates,
         deleteProp,
         pageNotFound,
         getCategorisedListings,
         searchListings,
        } from "../controllers/listings.controller.js"
import { upload } from "../middlewares/multer.js"

const router=Router()

router.route("/search").post(searchListings)

router.route("/").get(getAllListing)
router.route("/new").get(
        isLoggedIn,
        createNewProp)
router.route("/").post(
        isLoggedIn,
        upload.single("image"),
        saveNewProp)
router.route("/:id").get(getListingInfo)
router.route("/:id/edit").get(
        isLoggedIn,
        isOwner,
        editProp)
router.route("/:id").patch(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        saveUpdates)
router.route("/category/:type").get(
        getCategorisedListings
)
router.route("/:id/delete").delete(
        isLoggedIn,
        isOwner,
        deleteProp)




router.route("*").all(pageNotFound)

export default router