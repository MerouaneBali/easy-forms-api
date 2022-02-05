const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },
  created: { type: Date, default: Date.now },
  // inbox: { type: Array, default: [] },
  // inbox: [mongoose.Schema.Types.Mixed],
  inbox: [
    {
      created: {
        type: Date,
        default: Date.now,
      },
      resolved: { type: Boolean, default: false },
      opened: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  // inbox: [
  //   new mongoose.Schema({
  //     // default: {
  //     // },
  //     // _id: mongoose.Schema.ObjectId,
  //     created: { type: Date, default: Date.now },
  //     type: mongoose.Schema.Types.Mixed,
  //   }),
  // ],
});

module.exports = FormSchema;
