if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const dburl = process.env.ATLASDB_URL;
const { storage } = require("./cloudConfig.js");
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const review = require("./models/reviews.js");
const path = require("path");
const engine = require("ejs-mate");
const wrapAsycn = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
const listings = require("./routes/listing.js");
const users = require("./routes/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { islogedin, isownerUpdate } = require("./midddlewire.js");

const app = express();
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));
const methodoverride = require("method-override");
const multer = require("multer");
const upload = multer({ storage });
app.use(methodoverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
const mongostore = require("connect-mongo");
const flash = require("connect-flash");

const store = mongostore.create({
  mongoUrl: dburl,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("ERROR in mongosession store", err);
});

const sessionOption = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Must be BEFORE routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

async function main() {
  await mongoose.connect(dburl);
}
main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

//  Redirect to correct path
app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.use("/listing", listings);
app.use("/", users);

//Listing validation
const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((el) => el.message).join(","));
  } else {
    next();
  }
};
const validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((el) => el.message).join(","));
  } else {
    next();
  }
};

// Add listing route
app.get("/listing1/add", islogedin, (req, res) => {
  res.render("add.ejs");
});

app.post(
  "/createnew",
  upload.single("image"),
  wrapAsycn(async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let { title, description, country, location, price } = req.body;

    const chat1 = new Listing({
      title,
      description,
      country,
      location,
      price,
    });
    chat1.owner = req.user._id;
    chat1.image = { url, filename };

    await chat1.save();
    req.flash("success", "NEW LIST CREATED!");
    res.redirect("/listing");
  })
);

// Update listing
app.put(
  "/edit/:id",
  upload.single("image"),
  validateListing,
  wrapAsycn(async (req, res, next) => {
    const { id } = req.params;
    let { title, description, country, location, price } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      country,
      location,
      price,
      image: { url, filename },
    });

    req.flash("success", "LIST UPDATED!");
    res.redirect("/listing");
  })
);

// Delete listing
app.post(
  "/product-action/:id",
  wrapAsycn(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    if (action === "edit") {
      res.redirect(`/update/${id}`);
    } else if (action === "delete") {
      res.redirect(`/delete/${id}`);
    } else {
      res.redirect("/listing");
    }
  })
);

app.get(
  "/delete/:id",
  islogedin,
  isownerUpdate,
  wrapAsycn(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "LIST DELETED!");
    res.redirect("/listing");
  })
);

//  Update form
app.get(
  "/update/:id",
  islogedin,
  isownerUpdate,
  wrapAsycn(async (req, res) => {
    const { id } = req.params;
    let product = await Listing.findById(id);
    if (!product) {
      req.flash("error", "LIST NOT EXIST!");
      return res.redirect("/listing");
    }
    let originalimageurl = product.image.url;
    let original = originalimageurl.replace("/upload", "/upload/h_300,w_250");

    res.render("editform.ejs", { product, original });
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "page not found" } = err;
  res.status(statusCode).render("error.ejs", { err });
});


const port =  5050;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
