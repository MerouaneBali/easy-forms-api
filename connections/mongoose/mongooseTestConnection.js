const mongoose = require("mongoose");

const UserSchema = require("../../schemas/User");

const { MongoMemoryServer } = require("mongodb-memory-server");

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
  await mongod.start();
  const uri = await mongod.getUri();
  await mongoose.connect(uri);
};

module.exports.clear = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany();
  }
};

module.exports.disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.User = mongoose.model("User", UserSchema);
