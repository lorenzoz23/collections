const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    format: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

//const Tag = mongoose.model("Tag", tagSchema);
module.exports = tagSchema;
