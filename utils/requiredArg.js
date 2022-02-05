const requiredArg = () => {
  const error = new Error("Missing argument");

  Error.captureStackTrace(error, requiredArg);

  throw error;
};

module.exports = requiredArg;
