const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// Get all the pending connection request for the loggedIn User
router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested", //otherwise ignored and accepted will also be picked
    });
    res.json({
      message: "Data fetched successfully ",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
