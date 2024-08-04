const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGOURL = ("mongodb://127.0.0.1:27017/test");

main()
.then(() =>{
    console.log("MongoDB is connected");
})
.catch((err) => {
    console.log(err);
});


async function main () {
    await mongoose.connect(MONGOURL);
}

app.get("/", (req, res) =>{
    res.send("Hello World");
});

app.get("/testlisting", async (req, res) => {
    let samplelisting = new Listing({
        title: "Test Listing",
        description: "This is a test listing",
        image: "",
        price: 1200,
        location: "Test Location",
        country: "Test Country",
    });

   await samplelisting.save()
    .then((listing) => {
        console.log("Saved");
    })
    .catch((err) => {
        res.send(err);
    });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});