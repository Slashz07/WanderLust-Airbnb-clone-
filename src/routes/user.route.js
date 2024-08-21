import {Router} from "express"
import passport from "passport"

import { signUp,
         registered,
         pageNotFound,
         login,
         loggingIn,
         logout} from "../controllers/users.controller.js"
import { saveRedirectUrl } from "../middlewares/login.js"

const router=Router()

router.route("/signup").get(signUp)
router.route("/signup").post(registered)
router.route("/login").get(login)
router.route("/login").post(
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect:"/user/login",
            failureFlash:true
    }
    ),
    loggingIn)

router.route("/logout").get(logout)


router.route("*").all(pageNotFound)

export default router