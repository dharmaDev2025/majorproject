if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}
const dburl=process.env.ATLASDB_URL;
const{storage}=require("./cloudConfig.js");
const express = require("express");
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const review=require("./models/reviews.js");
const path=require("path");
const engine = require('ejs-mate');
const wrapAsycn=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {ListingSchema,reviewSchema}=require("./schema.js");
const listings=require("./routes/listing.js");
const users=require("./routes/user.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const{islogedin,isownerUpdate}=require("./midddlewire.js");







const app = express();
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));
const methodoverride=require("method-override");
const multer  = require('multer')
const upload = multer({storage});
const { error } = require("console");
app.use(methodoverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
const session=require("express-session");
 const mongostore=require("connect-mongo"); 
const flash=require("connect-flash");
const store=mongostore.create({
    mongoUrl:dburl,
    crypto:{
        secret:"mysupersecretcode"

    },
    touchAfter:24*3600,

});
store.on("error",()=>{
    console.log("ERROR in mongosession store",err);
});

 const sessionOption={
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true


    },
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





async function main() {
    await mongoose.connect(dburl);
}

main()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

app.get("/", (req, res) => {
    res.send("dharama");
});
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})
app.use("/listing",listings);
app.use("/",users);
// app.get("/demo",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta_student"
//     });
//     let registeredUser=await User.register(fakeuser,"helloworld");
//     res.send(registeredUser)

// });

const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        // validation error -> 400 (Bad Request)
        throw new ExpressError(400, error.details.map(el => el.message).join(","));
    } else {
        next();
    }
};
const validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
         throw new ExpressError(400, error.details.map(el => el.message).join(","));

    }
    else{
         next();

    }
}


// app.get("/listingtest",(req,res)=>{
//     const a=new Listing({
//         title:"my house",
//         description:"wow",
//         price:2345,
//         location:"bbsr",
//         country:'india'
//     })
//     a.save();

//     res.send("working");
// })
//show all place
// app.get("/listing",wrapAsycn(async(req,res)=>{
//     let products= await Listing.find();
//     res.render("listing.ejs",{products});
// }));
// //show a particular place
// app.get("/listing/:id",wrapAsycn(async(req,res)=>{
//     let{id}=req.params;
//     let product= await Listing.findById(id).populate("reviews");
//     res.render("product.ejs",{product});
// }));
//create new place or product
app.get("/listing1/add",islogedin,(req,res)=>{
    res.render("add.ejs");
});
// Create new listing
app.post("/createnew", //validateListing, 
    upload.single("image"),   
     wrapAsycn(async (req, res, next) => {
        let url=req.file.path;
        let filename=req.file.filename;
       
        let { title, description,country, location, price } = req.body; 
        

        const chat1 = new Listing({
            title,
            description,
            country,
            location,
            price
        });
        chat1.owner=req.user._id;
        chat1.image={url,filename};
  
        await chat1.save();
        req.flash("success","NEW LIST CREATED!")
        res.redirect("/listing");

}));

// Update listing
app.put("/edit/:id", upload.single("image"), validateListing, wrapAsycn(async (req, res, next) => {
        const { id } = req.params;
        let { title, description, country, location, price } = req.body;
         let url=req.file.path;
        let filename=req.file.filename;
       

        await Listing.findByIdAndUpdate(id, {
            title,
            description,
            country,
            location,
            price, // mongoose will cast this
            image: { url, filename }
        });
       
         req.flash("success"," LIST UPDATED!")
    
        res.redirect("/listing");
    
}));

//delete
app.post("/product-action/:id",wrapAsycn(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    if (action === "edit") {
        res.redirect(`/update/${id}`);
    } else if (action === "delete") {
        res.redirect(`/delete/${id}`);
    } else {
        res.redirect("/listing");
    }
}));
app.get("/delete/:id",islogedin,isownerUpdate,wrapAsycn(async(req,res)=>{
     await Listing.findByIdAndDelete(id);
        req.flash("success"," LIST DELETED!")
        res.redirect("/listing");


}));
//update the route
app.get("/update/:id",islogedin,isownerUpdate, wrapAsycn(async (req, res) => {
    const { id } = req.params;
     let product = await Listing.findById(id);
        if(!product){
          req.flash("error"," LIST  NOT EXIST!")
          return res.redirect("/listing");
          
        }
      let originalimageurl=product.image.url;
       let original= originalimageurl.replace("/upload","/upload/h_300,w_250")
    
    res.render("editform.ejs", { product,original });
}));
// app.post("/listing/:id/reviews",validatereview,wrapAsycn(async(req,res)=>{
//     let  listing=await Listing.findById(req.params.id);
//     let r=new review(req.body.review);
//     listing.reviews.push(r);
//     await r.save();
//     await listing.save();
//     res.redirect(`/listing/${listing._id}`)
// }));
//delete review route
// app.delete("/listing/:id/reviews/:reviewId",wrapAsycn(async(req,res)=>{
//     let{id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await review.findById(reviewId);
//     res.redirect(`/listing/${id}`);

// }));

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next )=>{
    let{statusCode=500,message="page not found"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})


app.listen(5050, () => {
    console.log("Server running on http://localhost:5050");
});
