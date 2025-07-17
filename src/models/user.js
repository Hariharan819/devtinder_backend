const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
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
      maxLength: 25,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Plz Enter the strong password" + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Url" + value);
        }
      },
    },
    description: {
      type: String,
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

Userschema.methods.getjwt = function () {
  const user = this;
  const userid = this._id;
  const token = jwt.sign({ userid }, "ScreatKey@Dev", {
    expiresIn: "7d",
  });

  return token;
};

//module
// const User = mongoose.model("User", Userschema);
// module.exports = User;
module.exports = mongoose.model("User", Userschema);
