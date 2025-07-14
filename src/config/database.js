const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://gparashar222:GEfI9kZVCsVNVSnw@cluster0.rhcgws5.mongodb.net/")
}

module.exports = connectDB;
