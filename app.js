const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});