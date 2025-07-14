const express = require("express");
const ProfileRoute = express.Router();
const UserAuth = require("../middleware/UserAuth");
const validator = require("validator");
const bcrypt = require("bcrypt");

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

ProfileRoute.patch("/forgotpassword", UserAuth, async (req, res) => {
  //data.password -->validation
  //encryption
  //storing
  try {
    const data = req.body;
    LoggedInUser = req.user;
    if (!validator.isStrongPassword(data.password)) {
      throw new Error("Plz Enter the strong password :" + data.password);
    }
    const Hashpasword = await bcrypt.hash(data.password, 10);
    LoggedInUser.password = Hashpasword;
    await LoggedInUser.save();
    res.send("password has been updated successfully");
  } catch (err) {
    res.status(404).send(err.message);
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

    const emailIdvalidation = Requestupdatefromuser.includes("emailId");

    const Profileurldvalidation = Requestupdatefromuser.includes("profileUrl");

    const genderdvalidation = Requestupdatefromuser.includes("gender");

    const firstnamevalidation = Requestupdatefromuser.includes("firstName");

    const skillsvalidation = Requestupdatefromuser.includes("skills");

    const descriptionvalidation = Requestupdatefromuser.includes("description");

    const agevalidation = Requestupdatefromuser.includes("age");

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
      const allowedgenders = ["male", "female", "others"].includes(data.gender);
      if (!allowedgenders) {
        throw new Error("Invalid Gender data");
      }
      LoggedInUser.gender = data.gender;
      await LoggedInUser.save();
    }

    if (firstnamevalidation) {
      if (data.firstName.length < 4) {
        throw new Error("User name is shorter than 4 letters ");
      }
      if (data.firstName.length > 50) {
        throw new Error("User name is higher than 50 letters ");
      }
      LoggedInUser.firstName = data.firstName;
      await LoggedInUser.save();
    }

    if (skillsvalidation) {
      if (data.skills.length > 11) {
        throw new Error("skills limit is existed plz enter below 10 skills ");
      }
      if (data.skills.length < 2) {
        throw new Error("plz enter atleast 2 skills ");
      }
      LoggedInUser.skills = data.skills;
      await LoggedInUser.save();
    }

    if (descriptionvalidation) {
      // const trimmedDescription = data.description.trim().replace(/\s+/g, " ");
      const trimmedDescription = String(data.description)
        .trim()
        .replace(/\s+/g, " ");

      if (trimmedDescription.length > 1000) {
        throw new Error("short description is allowed");
      }
      LoggedInUser.description = data.description;
      await LoggedInUser.save();
    }

    if (agevalidation) {
      if (typeof data.age !== "number") {
        throw new Error("Age must be a number");
      }

      if (data.age > 100) {
        throw new Error(" Age must be below 100");
      }
      if (data.age < 18) {
        throw new Error("Age must be above 18");
      }
      LoggedInUser.age = data.age;
      await LoggedInUser.save();
    }
    res.send(`${LoggedInUser.firstName} , your profile has been updated`);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
module.exports = ProfileRoute;
