const env = require("../configs/env");

// .env HANDLERS
const envParsedHandler = (parsed) => {
  console.log(`Env: Variables file loaded succefully`);
};

const envErrorHandler = (error) => {
  console.log(`Env: Variables file failed to load\n ${error}`);
};

// SERVER CONNECTION HANDLERS
const serverConnectionCallback = (port) => {
  console.log(`Server: Running on ${port}`);
};

// DB CONNECTION HANDLERS
const dbInitConnectionHanlder = (databaseName, err) => {
  console.log(
    `Mongoose (${databaseName}): Connection initialization failed\n ${err}`
  );
};

const dbConnectionOpenHandler = (databaseName, conn) => {
  console.log(`Mongoose (${databaseName}): Connection was established`);
};

const dbDisconnectHandler = (databaseName, err) => {
  console.log(`Mongoose (${databaseName}): Connection was dropped\n ${err}`);
};

const dbConnectionErrorHandler = (databaseName, err) => {
  console.log(
    `Mongoose (${databaseName}): Connection had a critical error and dropped\n ${err}`
  );
};

// REDIS CONNECTION HANDLERS
const redisConnectionOpenHandler = (databaseName) => {
  console.log(`Redis (${databaseName}): Connection was established`);
};

const redisDisconnectHandler = (databaseName, error) => {
  console.log(`Redis (${databaseName}): Connection was dropped\n ${error}`);
};

const redisConnectionErrorHandler = (databaseName, error) => {
  console.log(
    `Redis (${databaseName}): Connection had a critical error and dropped\n ${error}`
  );
};

// EXPORTS
module.exports = {
  envParsedHandler,
  envErrorHandler,
  serverConnectionCallback,
  dbInitConnectionHanlder,
  dbConnectionOpenHandler,
  dbDisconnectHandler,
  dbConnectionErrorHandler,
  redisConnectionOpenHandler,
  redisDisconnectHandler,
  redisConnectionErrorHandler,
};
