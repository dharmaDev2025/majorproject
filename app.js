const express = require("express");
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const engine = require('ejs-mate');
const wrapAsycn=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");



const app = express();
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));
const methodoverride=require("method-override");
const { error } = require("console");
app.use(methodoverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/majorproject');
}

main()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

app.get("/", (req, res) => {
    res.send("dharama");
});
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
app.get("/listing",wrapAsycn(async(req,res)=>{
    let products= await Listing.find();
    res.render("listing.ejs",{products});
}));
//show a particular place
app.get("/listing/:id",wrapAsycn(async(req,res)=>{
    let{id}=req.params;
    let product= await Listing.findById(id);
    res.render("product.ejs",{product});
}));
//create new place or product
app.get("/listing1/add",(req,res)=>{
    res.render("add.ejs");
});
// Create new listing
app.post("/createnew", 
     wrapAsycn(async (req, res, next) => {
        let { title, description, image, country, location, price } = req.body;

        const chat1 = new Listing({
            title,
            description,
            image,
            country,
            location,
            price
        });

        await chat1.save();
        res.redirect("/listing");

}));

// Update listing
app.put("/edit/:id", wrapAsycn(async (req, res, next) => {
        const { id } = req.params;
        let { title, description, image, country, location, price } = req.body;

        await Listing.findByIdAndUpdate(id, {
            title,
            description,
            image,
            country,
            location,
            price // mongoose will cast this
        });
        res.redirect("/listing");
    
}));

//delete
app.post("/product-action/:id",wrapAsycn(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    if (action === "edit") {
        res.redirect(`/update/${id}`);
    } else if (action === "delete") {
        await Listing.findByIdAndDelete(id);
        res.redirect("/listing");
    } else {
        res.redirect("/listing");
    }
}));
//update the route
app.get("/update/:id",  wrapAsycn(async (req, res) => {
    const { id } = req.params;
    let product = await Listing.findById(id);
    res.render("editform.ejs", { product });
}));

// app.put("/edit/:id", wrapAsycn(async(req,res)=>{
//     const{id}=req.params;
//     let{title}=req.body;
//     let{description}=req.body;
//     let{image}=req.body;
//     let{country}=req.body;
//     let{location}=req.body;
//     let{price}=req.body;
//     let chat1= await Listing.findByIdAndUpdate(id,{title: title,
//       price:price,
//       description:description,
//       image:image,
//       country:country,
//       location:location,
// });
// res.redirect("/listing")
      

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
