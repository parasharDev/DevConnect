const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 25,unique:true },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    age: { type: Number, min: 10 },
    gender: {
      type: String,
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Geneder Data is not valid");
      //   }
      // },
      enum:{
        values:["male","female","others"],
        message:`{VALUE} is not a valid gender`
      }
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: { type: String, default: "This is a default about of the user" },
    skills: { type: [String] },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this; //this is the user
  const token = await jwt.sign({ _id: user.id }, "DEV@Tinder&790", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  // passwordInputByUser & passwordHash are not interchangeable
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
