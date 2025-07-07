const express = require("express");
const connectDB = require("./src/config/database");
const app = express();

//require the our db model
app.use(express.json());
const User = require("./src/models/user");
app.post("/signup", async (req, res) => {
  // const userdata = {
  //   firstName: "hariharan",
  //   lastName: "V",
  //   emailId: "hariharan@gamil.com",
  //   password: "hariharan@124",
  // };

  //need to create a instance of our model that is User

  // const user = new User(userdata);

  const user = new User(req.body);
  try {
    await user.save();
    res.send(" user data is added to our database");
  } catch (error) {
    res.status(400).send("error in saving user data");
  }
});

//wrap it in try catch also to avoid errors

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
