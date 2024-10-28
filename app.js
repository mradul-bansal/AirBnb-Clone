const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js")

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  try {
    await mongoose.connect(MONGOURL, {});
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error);
  }
  next();
}

// Index Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/listings", wrapAsync(async (req, res) => {
  try {
    const allListings = await Listing.find({}).exec();
    // console.log("alllistings",allListings);
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).exec();
    if (listing) {
      res.render("listings/show.ejs", { listing });
    } else {
      res.status(404).send("Listing not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listing");
  }
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings")
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).exec();
    if (listing) {
      res.render("listings/edit.ejs", { listing });
    } else {
      res.status(404).send("Listing not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listing");
  }
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { listing } = req.body;
    await Listing.findByIdAndUpdate(id, listing, { new: true });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating listing");
  }
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting listing");
  }
}));

app.all("*", (req, res, next) =>{
  next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
  let { statusCode=500, message="Something Went Wrong!"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", {message});
});