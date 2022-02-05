const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: String,
  forms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Form",
    },
  ],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  created: { type: Date, default: Date.now },
});

module.exports = ProjectSchema;
