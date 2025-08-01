const express = require("express"); // calls the express file from node_modules
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); //every route will go through this function because of use

// 1.Signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body); //Creating a new instance of user model
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

// 2.Feed API - GET /feed - get all the users from the db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// 3.User.findOne --> will send the oldest document

// 4.Get user by email
app.get("/user", async (req, res) => {
  console.log(req.body.emailId);
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// 5.Delete User
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ userId });
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//6. Update User
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const body = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, body, {
      runValidators: true,
    }); // {userId} is also Ok //we can optional filed beforeUpdate and afterUpdate
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//In the patch method, runValidators is used otherwise validation 
//like gender will run for new documents but nor for the existinf documents

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
