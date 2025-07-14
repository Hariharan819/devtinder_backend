const express = require("express");
const connectDB = require("./src/config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

//middleware for receiving body-data from post api
app.use(express.json());
//reading cookie from req.body
app.use(cookieParser());

//require  our db model

const User = require("./src/models/user");

const AuthRoute = require("./src/routes/AuthRoute");
const ProfileRoute = require("./src/routes/ProfileRoute");

app.use("/", AuthRoute);
app.use("/", ProfileRoute);



//connect db and after that server listen to the port 3000
connectDB()
  .then(() => {
    console.log("Database is connected sucessfully....");
    app.listen(3000, () => {
      console.log("server is succcesfully running on port:3000...");
    });
  })
  .catch((err) => {
    console.error("Database is not connected");
  });
