const express = require("express");
const connectDB = require("./src/config/database");
const app = express();

//middleware for receiving body-data from post api
app.use(express.json());

//require  our db model
const User = require("./src/models/user");

// const userdata = {
//   firstName: "hariharan",
//   lastName: "V",
//   emailId: "hariharan@gamil.com",
//   password: "hariharan@124",
// };

//add the userdata to database

app.post("/signup", async (req, res) => {
  //need to create a instance of our model that is User
  // const user = new User(userdata);
  //wrap it in try catch to avoid errors
  //use async and awit in all db related logics
  try {
    const user = new User(req.body);
    await user.save();
    res.send(" user data is added to our database");
  } catch (error) {
    res.status(400).send("error in saving user data");
  }
});

//get all the user from data base
app.get("/feed", async (req, res) => {
  try {
    const usersdata = await User.find({});
    //becoz it is array so it is best way to avoid empty array
    if (usersdata.length === 0) {
      res.res.status(404).send("no  user is there with matching email ");
    } else {
      res.send(usersdata);
    }
  } catch (error) {
    res.status(400).send("no users");
  }
});

//get user by request(from api ) matching email
app.get("/user", async (req, res) => {
  try {
    const useremail = req.body.emailId;
    const matchedemail = await User.find({ emailId: useremail });
    res.send(matchedemail);
  } catch (error) {
    res
      .status(404)
      .send("something went wrong on finding request  email user ");
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
    res.status(404).send("something went wrong on finding request userById");
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
    res.status(404).send("something went wrong on deleting request userById");
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
    res.status(404).send("something went wrong on updating  user data");
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
