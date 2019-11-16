const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["host", "admin"],
      default: "host"
    },
    password: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
