const User=require("../models/user");
const passport = require("passport");
module.exports.signupform=(req,res)=>{
    res.render("user/signupform.ejs");
}
 module.exports.postsignup=async(req,res)=>{
   let{username,email,password}=req.body;
   const newUser=new User({email,username});
   const regidterUser=await User.register(newUser,password);
   req.login(regidterUser,(err)=>{
    if(err){
        return next(err);
    }
     req.flash("success","welcome to wanderlust");
     res.redirect("/listing");

   });
  
}
module.exports.loginform=(req,res)=>{
    res.render("user/login.ejs")
}
module.exports.postlogin=passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,

}), async(req,res)=>{
    req.flash("success","You are successfully logged in");
    const redirecturl=res.locals.redirecturl||"/listing"
    res.redirect(redirecturl);

}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing")
    })


}