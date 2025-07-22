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

RequestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    //need to find the connecton request by using id which is requestId

    // the touserID must be equal to loggedin user id

    // the allowed status must be Accepted and Rejected

    //the status Interested means we need to proceed further

    try {
      const LoggedInUser = req.user;
      const status = req.params.status;
      const requestid = req.params.requestId;
      const allowedStatus = ["Accepted", "Rejected"];
      const validstatus = allowedStatus.includes(status);
      if (!validstatus) {
        throw new Error(" Invalid Status Type");
      }
      const validtouser = await Connectionrequestsmodule.findOne({
        _id: requestid,
        toUserId: LoggedInUser._id,
        status: "Interested",
      });
      if (!validtouser) {
        throw new Error("Conncetion Request not Found");
      }
      validtouser.status = status;
      await validtouser.save();
      res.send(`Connection Request is ${status}`);
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);
module.exports = RequestRouter;
