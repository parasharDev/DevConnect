const express = require("express"); // calls the express file from node_modules

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello from the server.....")
})

app.listen(3000,()=>{
    console.log("Server is running successfully on port 3000")
})



