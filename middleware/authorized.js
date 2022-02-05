/**
 * @module authorized
 *
 * @category Middleware
 *
 * @description Accept requests accompanied with a valid JWT authorization token, and reject the rest
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function
 *
 * @returns {Object} Request object with new user property containing the Mongoose user object
 *
 * @throws {Error} Rejects the request and returns 401 when user in not authenticated
 * @throws {Error} Rejects the request and returns 403 when user `emailVerified` property in set to `false`
 * @throws {Error} Rejects the request and returns 404 when user does not exist
 * @throws {Error} Rejects the request and returns 500 when server internal error happends
 */
module.exports = async (req, res, next) => {
  const { User } = require("../models");

  try {
    if (!req.session.user) throw new Error(401);

    try {
      const user = await User.findById(req.session.user);

      if (user === null) throw new Error(404);

      if (!user.emailVerified) throw new Error(403);

      req.user = user;

      // res.user = { email: user.email };

      console.log("nexting");

      return next();
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (
      error.message === "401" ||
      error.message === "404" ||
      error.message === "403"
    ) {
      console.log(req.headers.cookie, error);

      return res.sendStatus(error.message);
    }

    return res.sendStatus(500);
  }
};
