const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  console.log("Edit Profile Request Body:", req.body);
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Editt Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save()
    res.send(`${loggedInUser.firstName}, your profile updated successfully!`)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
