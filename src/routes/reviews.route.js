import { Router } from "express"
const router=Router({mergeParams:true})//it ensures that if the parent url in app.js has any params then they are passed to the params of this router as well,otherwise they are left within the app.js only
import {createReviews,
        deleteReview,
        pageNotFound} from "../controllers/reviews.controller.js"
import { isLoggedIn, isReviewAuthor } from "../middlewares/login.js"

router.route("/").post(
        isLoggedIn,
        createReviews)
router.route("/:reviewId").delete(
        isLoggedIn,
        isReviewAuthor,
        deleteReview)


router.route("*").all(pageNotFound)

export default router