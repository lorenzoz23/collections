const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const movieSchema = require("./movie.model");
const tagSchema = require("./tag.model");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 6,
      maxlength: 20
    },
    password: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minLength: 8
    },
    tags: [tagSchema],
    movies: [movieSchema]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
