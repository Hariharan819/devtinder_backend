const express = require("express");
const app = express();
const User = require("../models/user");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const jwt = require("jsonwebtoken");
const UserAuth = async (req, res, next) => {
  try {
    //get cookies which is send as response from server
    const cookies = req.cookies;
    //take token from cookies
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    //decode the token to get hide data which is user id
    const decodedata = await jwt.verify(token, "ScreatKey@Dev");
    const userid = decodedata.userid;
    //find the user by userid
    const user = await User.findById(userid);
    if (!user) {
      throw new Error("user does not exist ");
    }
    //store the user data in req
    req.user = user;

    //above all pass then only it call the nxt route handler
    next();

    // res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = UserAuth;
