const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    rated: {
      type: String,
      required: true
    },
    runtime: {
      type: String,
      required: true
    },
    director: {
      type: String,
      required: true
    },
    plot: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      required: true
    },
    tagFormat: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

//const Movie = mongoose.model("Movie", movieSchema);
//module.exports = Movie;
module.exports = movieSchema;
