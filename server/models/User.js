const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user"
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
