const express = require("express");
const UserAuth = require("../middleware/UserAuth");
const Connectionrequestsmodule = require("../models/connectionrequest");
const { equals } = require("validator");
const user = require("../models/user");
const RequestRouter = express.Router();

RequestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedinuserdata = req.user;
      const fromUserId = loggedinuserdata._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionrequest = new Connectionrequestsmodule({
        fromUserId,
        toUserId,
        status,
      });

      // console.log(existingconnectionrequest);
      if (!["Interested", "NotInterested"].includes(status)) {
        throw new Error("Invalid status");
      }
      const validatetoUserid = await user.findById(toUserId);
      if (!validatetoUserid) {
        throw new Error("user not found");
      }
      if (fromUserId.equals(toUserId)) {
        throw new Error("you cannot send request to yourself!!");
      }
      const existingconnectionrequest = await Connectionrequestsmodule.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingconnectionrequest) {
        throw new Error("connection request already exists");
      }
      await connectionrequest.save();
      res.send("connection request send successfully");
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = RequestRouter;
