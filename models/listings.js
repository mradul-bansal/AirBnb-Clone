const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: {
            filename: String,
            url: String,
        },
        default: {
            filename: "",
            url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector%2Fno-image-available-icon-vector-illustration-flat-design-247872612.html&psig=AOvVaw2fCccB_tz49TYIzwexBynf&ust=1722833497716000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMiNxYrF2ocDFQAAAAAdAAAAABAE",
        },
    },
    price: Number,
    location: String,
    Country: String,
});

const Listing = mongoose.model("listings", listingSchema);
module.exports = Listing;  //export the model