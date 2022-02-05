// LIB IMPORTS
const mongoose = require("mongoose");

// CALLBACK IMPORTS
const {
  dbConnectionOpenHandler,
  dbDisconnectHandler,
  dbConnectionErrorHandler,
} = require("../../utils/handlers");

// SCHEMA IMPORTS
const UserSchema = require("../../schemas/User");
const ProjectSchema = require("../../schemas/Project");
const FormSchema = require("../../schemas/Form");

const initMainConnection = async () => {
  const connection = await mongoose
    .createConnection(process.env.MAIN_DB_CONNECTION, {})
    .on("open", () => dbConnectionOpenHandler("Main"))
    .on("disconnect", (err) => dbDisconnectHandler("Main", err))
    .on("error", (err) => dbConnectionErrorHandler("Main", err));

  connection.model("User", UserSchema);
  connection.model("Project", ProjectSchema);
  connection.model("Form", FormSchema);

  return connection;
};

const getMainConnection = initMainConnection();

module.exports = {
  initMainConnection,
  getMainConnection,
};
