const express = require("express");
const connectDB = require("./src/config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

//middleware for receiving body-data from post api
app.use(express.json());
app.use(cookieParser());
//require  our db model
const User = require("./src/models/user");
const UserAuth = require("./src/middleware/UserAuth");

// const userdata = {
//   firstName: "hariharan",
//   lastName: "V",
//   emailId: "hariharan@gamil.com",
//   password: "hariharan@124",
// };

//add the userdata to database

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    const userid = user._id;
    // console.log(userid);
    if (!user) {
      throw new Error("Invalid Credtials");
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);

    // const userid = user.userId;

    if (ispasswordvalid) {
      //
      const token = await jwt.sign({ userid }, "ScreatKey@Dev", {
        expiresIn: "7d",
      });

      // const token = await user.getjwt();
      //gethwt is usecheme method used for proper code refraction

      //add the token to the cookie and send back to the user
      //name of cookie and token
      res.cookie("token", token),
        { expires: new Date(Date.now() + 7 * 3600000) };

      res.send("Login Successfully");
    } else {
      throw new Error("Invalid credtials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", UserAuth, async (req, res) => {
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
//get all the user from data base
app.get("/feed", async (req, res) => {
  try {
    const usersdata = await User.find({});
    //becoz it is array so it is best way to avoid empty array
    if (usersdata.length === 0) {
      res.status(404).send("no  user is there with matching email ");
    } else {
      res.send(usersdata);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//get user by request(from api ) matching email
app.get("/user", async (req, res) => {
  try {
    const useremail = req.body.emailId;
    const matchedemail = await User.find({ emailId: useremail });
    res.send(matchedemail);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//get user by request(from api) matching userId
app.get("/user", async (req, res) => {
  try {
    const userid = req.body.userId;
    console.log(userid);
    const matchedId = await User.findById(userid);
    res.send(matchedId);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//delete user by request(from api) matching userId
app.delete("/user", async (req, res) => {
  try {
    const userid = req.body.userId;
    console.log(userid);
    const matchedId = await User.findByIdAndDelete(userid);
    res.send("this userid data is deleted");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//update user by request(from api) matching userId

app.patch("/user", async (req, res) => {
  try {
    const userid = req.body.userId;
    const data = req.body;
    //only these fields are updated by user after creating user profile
    const allowedchanges = ["skills", "description", "profileUrl", "gender"];
    const isupdateallowed = Object.keys(data).every((k) => {
      allowedchanges.includes(k);
    });
    if (!isupdateallowed) {
      throw new Error("updates are not allowed");
    }
    //skills more than 10 not allowed
    if (data?.skills?.length > 10) {
      throw new Error("only 10 skills are allowed");
    }
    const updateduserdata = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user data is updated successfully ");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

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
