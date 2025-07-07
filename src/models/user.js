const mongoose = require("mongoose");
//schema

const Userschema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
});

//module
// const User = mongoose.model("User", Userschema);
// module.exports = User;
module.exports = mongoose.model("User", Userschema);
