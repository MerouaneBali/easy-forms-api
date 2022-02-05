// LIB IMPORTS
const mongoose = require("mongoose");

// CONNECTION 1 - CLIENTS DB
exports.User = mongoose.connections[1].model("User");
exports.Project = mongoose.connections[1].model("Project");
exports.Form = mongoose.connections[1].model("Form");
