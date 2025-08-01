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
    // console.log(currentuserId);

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

    res.send(currentuserconnections);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = UserRouter;
