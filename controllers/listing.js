const Listing=require("../models/listing");
const review = require("../models/reviews.js");
module.exports.index=async (req, res) => {
    let products = await Listing.find();
    res.render("listing.ejs", { products });
}
//for show a particular list
module.exports.showaparticular=async (req, res) => {
    let { id } = req.params;
    let product = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!product){
        req.flash("error","no list as you  search here");
         return res.redirect("/listing")

    }
  res.render("product.ejs", { product });
}
//add a review
 module.exports.addreview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let r = new review(req.body.review);
    r.author=req.user._id;
    listing.reviews.push(r);
    await r.save();
    await listing.save();
     req.flash("success","new review added!")
    res.redirect(`/listing/${listing._id}`);
}
//delete areview
module.exports.deletereview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
     req.flash("success","new review deleted!")
    
    res.redirect(`/listing/${id}`);
}