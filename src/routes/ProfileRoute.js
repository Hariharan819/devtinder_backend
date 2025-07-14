const express = require("express");
const ProfileRoute = express.Router();
const UserAuth = require("../middleware/UserAuth");
const validator = require("validator");

ProfileRoute.get("/profile/view", UserAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    // if (!token) {
    //   throw new Error("Invalid Token");
    // }
    // const decodedata = await jwt.verify(token, "ScreatKey@Dev");
    // const userid = decodedata.userid;
    const user = req.user;
    // const user = await User.findById(userid);
    // if (!user) {
    //   throw new Error("user does not exist ");
    // }

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

ProfileRoute.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    const data = req.body;
    const LoggedInUser = req.user; //user of current loged in user

    //only these fields are updated by user after creating user profile
    const allowedchanges = [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "skills",
      "description",
      "profileUrl",
      "gender",
    ];
    const isupdateallowed = Object.keys(data).every((k) => {
      return allowedchanges.includes(k);
    });
    if (!isupdateallowed) {
      throw new Error("updates are not allowed");
    }
    // Object.keys(data).forEach((k) => {
    //   LoggedInUser[k] = data[k];
    // });
    // await LoggedInUser.save();
    const Requestupdatefromuser = Object.keys(data);
    // console.log(Requestupdatefromuser);

    const emailIdvalidation = Requestupdatefromuser.includes("emailId");

    const Profileurldvalidation = Requestupdatefromuser.includes("profileUrl");

    const genderdvalidation = Requestupdatefromuser.includes("profileUrl");

    if (emailIdvalidation) {
      if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid Email address:" + data.emailId);
      }
      LoggedInUser.emailId = data.emailId;
      await LoggedInUser.save();
    }

    if (Profileurldvalidation) {
      if (!validator.isURL(data.profileUrl)) {
        throw new Error("Invalid Url" + data.profileUrl);
      }
      LoggedInUser.profileUrl = data.profileUrl;
      await LoggedInUser.save();
    }

    if (genderdvalidation) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Invalid Gender data");
      }
      LoggedInUser.gender = data.gender;
      await LoggedInUser.save();
    }

    res.send(`${LoggedInUser.firstName} , your profile has been updated`);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
module.exports = ProfileRoute;
