const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please input Full Name"],
    },
    email: {
      type: String,
      required: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please input Password"],
    },
    role: {
      type: String,
      required: false,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
