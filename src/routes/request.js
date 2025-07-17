const express = require("express");
const UserAuth = require("../middleware/UserAuth");
const Connectionrequestsmodule = require("../models/connectionrequest");
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
      await connectionrequest.save();
      res.send("connection request send successfully");
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);

module.exports = RequestRouter;
