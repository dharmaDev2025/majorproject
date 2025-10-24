const Joi=require("joi");
const reviews = require("./models/reviews");
const ListingSchema=Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.string().allow("",null),

});
const reviewSchema=Joi.object({
        review:Joi.object({
         comment:Joi.string().required(),
         rating:Joi.number().required()

        }).required()
        
});
module.exports={reviewSchema,ListingSchema};