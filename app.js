const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.get("/listings", async (req, res) => {
    try {
      const allListings = await Listing.find({});
      console.log(allListings); // Log the allListings variable
      res.render("listings/index", { allListings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching listings");
    }
  });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});