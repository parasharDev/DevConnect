const express = require("express");
const router = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      console.log(1);
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT(); //user instance created from line 41
      //Add the token to cookie and send the response
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 7 * 3600000),
      }); //cookie will expire in 7 days
      res.send(user);
    } else {
      console.log(2);
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful!");
});

module.exports = router;
