const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const  ListingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://www.google.com/imgres?q=short%20image%20link%20which%20works%20place%20of%20any%20in%20india&imgurl=https%3A%2F%2Fs7ap1.scene7.com%2Fis%2Fimage%2Fincredibleindia%2F1-bandra-worli-sea-ink-mumbai-maharashtra-attr-hero%3Fqlt%3D82%26ts%3D1742195253156&imgrefurl=https%3A%2F%2Fwww.incredibleindia.gov.in%2Fen&docid=FYcIOjGXfENRaM&tbnid=yhn70MJSF6jlMM&vet=12ahUKEwjS85W7n8mPAxUNSGwGHQskF1AQM3oECBgQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwjS85W7n8mPAxUNSGwGHQskF1AQM3oECBgQAA",
        set:(v)=>v==""?"https://www.google.com/imgres?q=short%20image%20link%20which%20works%20place%20of%20any%20in%20india&imgurl=https%3A%2F%2Fs7ap1.scene7.com%2Fis%2Fimage%2Fincredibleindia%2F1-bandra-worli-sea-ink-mumbai-maharashtra-attr-hero%3Fqlt%3D82%26ts%3D1742195253156&imgrefurl=https%3A%2F%2Fwww.incredibleindia.gov.in%2Fen&docid=FYcIOjGXfENRaM&tbnid=yhn70MJSF6jlMM&vet=12ahUKEwjS85W7n8mPAxUNSGwGHQskF1AQM3oECBgQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwjS85W7n8mPAxUNSGwGHQskF1AQM3oECBgQAA":v,
    },
    price:Number,
    location:String,
    country:String,
});
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;