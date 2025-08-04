const express = require("express");
const UserAuth = require("../middleware/UserAuth");
const Connectionrequestsmodule = require("../models/connectionrequest");
const User = require("../models/user");
const UserRouter = express.Router();

UserRouter.get("/user/requests/received", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user;
    const Receivedrequest = await Connectionrequestsmodule.find({
      toUserId: LoggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "profileUrl",
      "description",
    ]);
    res.json({
      message: "Here is your Connection Request",
      data: Receivedrequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

UserRouter.get("/user/allconncetions", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user;
    const Acceptedconnections = await Connectionrequestsmodule.find({
      $or: [
        { toUserId: LoggedInUser._id, status: "Accepted" },
        { fromUserId: LoggedInUser._id, status: "Accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "profileUrl",
        "description",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "profileUrl",
        "description",
      ]);

    const fromuserdata = Acceptedconnections.map((r) => {
      if (r.fromUserId._id.equals(LoggedInUser._id)) {
        return r.toUserId;
      }
      return r.fromUserId;
    });

    res.send(fromuserdata);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
UserRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const currentuser = req.user;
    const currentuserId = currentuser._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const currentuserconnections = await Connectionrequestsmodule.find({
      $or: [
        {
          fromUserId: currentuserId,
        },
        {
          toUserId: currentuserId,
        },
      ],
    }).select("fromUserId toUserId");

    const hiddenusers = new Set();
    currentuserconnections.forEach((connection) => {
      hiddenusers.add(connection.fromUserId.toString());
      hiddenusers.add(connection.toUserId.toString());
    });

    const feedusers = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hiddenusers) },
        },
        {
          _id: { $ne: currentuserId },
        },
      ],
    })
      .select([
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "profileUrl",
        "description",
      ])
      .skip(skip)
      .limit(limit);

    res.send(feedusers);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = UserRouter;
