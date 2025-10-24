const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");
const wrapAsycn = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("../schema.js");
const { islogedin,isReviewAuthor } = require("../midddlewire.js");
const listingcontroller=require("../controllers/listing.js");

// Validation middlewares
const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(","));
    } else {
        next();
    }
};

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(","));
    } else {
        next();
    }
};

// Show all listings
router.get("/", wrapAsycn(listingcontroller.index));

// Show a specific listing
router.get("/:id", wrapAsycn(listingcontroller.showaparticular));

// Add a review
router.post("/:id/reviews",islogedin, validatereview, wrapAsycn(listingcontroller.addreview));

// Delete a review
router.delete("/:id/reviews/:reviewId",islogedin,isReviewAuthor, wrapAsycn(listingcontroller.deletereview));

module.exports = router;
