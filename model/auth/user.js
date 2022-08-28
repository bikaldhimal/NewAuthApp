const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      max: 100,
      min: 1,
      required: false,
      default: 1,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      minLength: 10,
      default: "98XXXXXXXX",
      required: false,
    },
    address: {
      type: String,
      maxLength: 100,
      required: false,
      default: "Your Location",
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    isRole: {
      type: String,
      required: true,
      default: "1",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
