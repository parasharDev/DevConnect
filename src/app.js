const express = require("express"); // calls the express file from node_modules
const app = express();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const User = require("./models/user");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use(express.json()); //every route will go through this function because of use
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


// 4.Feed API - GET /feed - get all the users from the db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// 4.User.findOne --> will send the oldest document

// 5.Get user by email
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

// 6.Delete User
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ userId });
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//7. Update User
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    // for items other than ALLOWED_UPDATES
    // it should not be allowed to update
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed"); //it will activate the catch
    }
    //restrict the number of skills
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    }); // {userId} is also Ok //we can optional filed beforeUpdate and afterUpdate
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed:" + err.message);
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
