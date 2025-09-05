const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

// Send Connection Request
router.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      status = req.params.status;

      //any random status is restricted
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type:" + status });
      }

      //restricting sending request to unregistered user
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //if there is an existing ConnectionRequest both from A->B & B->A
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "Connection Request Sent Successfully", data });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);

// Review Request

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      //restricting random status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // verifying if a interested request has been sent to accept or reject
      const connectionRequest = await ConnectionRequest.findOne({
        _id: new mongoose.Types.ObjectId( requestId), // this field validates the requestId created in the ConnectionRequest table
        toUserId: loggedInUser._id,
        status: "interested", // this field restricts multiple accept,reject
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }

      // changing the connection request and saving it
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      return res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);

module.exports = router;
