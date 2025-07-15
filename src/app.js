const express = require("express"); // calls the express file from node_modules

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Parashar",
    lastName: "Ghosh",
    emailId: "parasharg123@gmail.com",
    password: "123",
  };

  //Creating a new instance of user model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running successfully on port: 3000");
    });
  })
  .catch((err) => {
    console.error("Databse cannot be connected!");
  });
