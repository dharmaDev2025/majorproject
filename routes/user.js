const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const{saveRedirectUrl}=require("../midddlewire.js");
const usercontroller=require("../controllers/user.js");

router.get("/signup",usercontroller.signupform);
router.post("/signup",usercontroller.postsignup);
router.get("/login",usercontroller.loginform);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async (req, res) => {
    req.flash("success", "You are successfully logged in");

    // 🧠 Fix: Don't redirect to a DELETE route
    let redirecturl = res.locals.redirecturl || "/listing";

    // If the saved URL contains a DELETE or PUT method, redirect to listing page instead
    if (redirecturl.includes("_method=DELETE") || redirecturl.includes("_method=PUT")) {
        const match = redirecturl.match(/\/listing\/([^\/]+)/); // extract listing id if possible
        if (match) {
            redirecturl = `/listing/${match[1]}`; // redirect to listing details
        } else {
            redirecturl = "/listing"; // fallback
        }
    }

    res.redirect(redirecturl);
});

router.get("/logout",usercontroller.logout);
module.exports=router;