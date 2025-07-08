const mongoose = require("mongoose");
//schema

const Userschema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 25,
    },
    gender: {
      type: String,

      //this validate fn is used while creating a databaase but this is not enabled in update the use data
      //so we nned to enable it by options in findbyidandupdate
      //refer documentation

      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender data");
        }
      },
    },
    age: {
      type: Number,
    },
    profileUrl: {
      type: String,
      trim: true,
      default: "https://www.flaticon.com/free-icon/profile_3135715",
    },
    description: {
      type: String,
      maxLength: 250,
      default: "Iam a pro Dev",
    },
    skills: {
      type: [String],
    },
  },
  {
    //user created data time
    timestamps: true,
  }
);

//module
// const User = mongoose.model("User", Userschema);
// module.exports = User;
module.exports = mongoose.model("User", Userschema);
