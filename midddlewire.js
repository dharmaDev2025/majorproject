const Listing = require("./models/listing");
const { findById } = require("./models/reviews");
const Reviews =require("./models/reviews");


module.exports.islogedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in to create listings");
         return res.redirect("/login");

    }
    next();

};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
     res.locals.redirecturl=req.session.redirecturl;

    }
    next();

}
module.exports.isownerUpdate=async(req,res,next)=>{
    const{id}=req.params;
    const list=await Listing. findById(id);
   if (!list.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();

}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Reviews.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
