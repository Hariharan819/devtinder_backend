const express = require("express");
const AuthRoute = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/user");

AuthRoute.post("/signup", async (req, res) => {
  //validate the data (req.body) //firstname min and max length and required ,lastname optional,valid email a,strong password
  // (i done those in schema level ,if there is not done ,here we can done by creating a function and call it here called helper function)

  //need to create a instance of our model that is User
  // const user = new User(userdata);
  //wrap it in try catch to avoid errors
  //use async and awit in all db related logics

  try {
    const {
      firstName,
      password,
      lastName,
      emailId,
      gender,
      age,
      profileUrl,
      description,
      skills,
    } = req.body;
    //encrypt the password and store it in db, here we use bcrypt npm package
    const Hashpasword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      age,
      profileUrl,
      description,
      skills,
      password: Hashpasword,
    });
    await user.save();
    res.send(" user data is added to our database");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

AuthRoute.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    const userdata = await User.findOne({ emailId: emailId }).select([
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "profileUrl",
      "description",
    ]);
    const userid = user._id;
    // console.log(userid);
    if (!user) {
      throw new Error("Invalid Credtials");
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);

    // const userid = user.userId;

    if (ispasswordvalid) {
      //
      const token = jwt.sign({ userid }, "ScreatKey@Dev", {
        expiresIn: "7d",
      });

      // const token = await user.getjwt();
      //gethwt is usecheme method used for proper code refraction

      //add the token to the cookie and send back to the user
      //name of cookie and token
      res.cookie("token", token),
        { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };

      res.send(userdata);
    } else {
      throw new Error("Invalid credtials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

AuthRoute.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logout Successfully");
});

module.exports = AuthRoute;
