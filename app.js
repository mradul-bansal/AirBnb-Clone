const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

main()
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOURL);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Index Route
app.get("/listings", async (req, res) => {
    try {
      const allListings = await Listing.find({});
      console.log(allListings);
      res.render("listings/index", { allListings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching listings");
    }
  });

// Show Route
app.get("/listings/:id", async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (listing) {
        res.render("listings/show.ejs", { listing });
      } else {
        res.status(404).send("Listing not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching listing");
    }
  });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});