const express = require("express"); // calls the express file from node_modules

const connectDB = require("./config/database")

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the server....")
})

connectDB().then(() => {
    console.log("Database connected successfully")
    app.listen(3000, () => {
        console.log("Server is running successfully on port: 3000")
    })
}).catch(err => { console.error("Databse cannot be connected!") })





