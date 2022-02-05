const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const authorized = require("../middleware/authorized");

const authenticationValidationSchemas = require("../validation/authenticationValidationSchemas");

const emailVerification = require("../controllers/emailVerification");
const resetPassword = require("../controllers/resetPassword");

const env = require("../configs/env");

/**
 * @module authentication
 *
 * @category Routes
 *
 * @description Express router handling authentication related requests
 *
 * @requires express
 */

/**
 * @name /register-[POST]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Registers new user and send him an email verification link through email
 *
 * @requires User
 * @requires bcrypt
 * @requires emailVerification
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {201} In case user is successfully created
 * @returns {400} In case of validation error
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 *
 * @returns {{status: Number, data: String}} {status: 201} In case user was successfully created and logged in
 * @returns {{status: Number, data: String}} {status: 400, data: 'validation error message'} In case of validation error
 * @returns {{status: Number}} {status: 409} In case user with the same email already exists
 * @returns {{status: Number}} {status: 500} In case of any internal server error
 */
router.post("/register", async (req, res) => {
  const { User } = require("../models");

  const body = {
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  };

  const { error, value } =
    authenticationValidationSchemas.register.validate(body);

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const user = await User.exists({ email: value.email });

    if (user) throw new Error(409);
  } catch (error) {
    if (error.message === "409") {
      return res.sendStatus(409);
    }

    return res.sendStatus(500);
  }

  try {
    const hash = await bcrypt.hash(value.password, 10);

    value.hash = hash;

    delete value.passwordConfirmation;
  } catch (error) {
    return res.sendStatus(500);
  }

  try {
    const user = new User(value);

    await user.save();

    try {
      await emailVerification.start(user.email);
    } catch (error) {
      // NOTE: Ingore error and continue
    }

    try {
      req.session.user = user.id;

      return res.sendStatus(201);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @name /login-[POST]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Logs in user and send him an authorization JWT
 *
 * @requires User
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires emailVerification
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {{status: Number, data: String}} {status: 200} In case was successfully logged in
 * @returns {{status: Number, data: String}} {status: 400, data: 'validation error message' || 'wrong password'} In case of validation error
 * @returns {{status: Number}} {status: 404} In case user does not exists
 * @returns {{status: Number}} {status: 500} In case of any internal server error
 */
router.post("/login", async (req, res) => {
  const { User } = require("../models");

  const body = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error, value } = authenticationValidationSchemas.login.validate(body);

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const user = await User.findOne({ email: value.email });

    if (user) {
      try {
        const result = await bcrypt.compare(value.password, user.hash);

        if (!result) throw new Error(400);
      } catch (error) {
        throw error;
      }

      try {
        req.session.user = user.id;
        console.log(req.session);

        return res.sendStatus(200);
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error(404);
    }
  } catch (error) {
    if (error.message === "400") {
      return res
        .status(400)
        .json({ field: "password", message: "Password is incorrect" });
    } else if (error.message === "404") {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
});

/**
 * @name /verifyEmail-[POST]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Send user email verification link through email
 *
 * @requires User
 * @requires emailVerification
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {200} In case email verification link was successfully sent
 * @returns {400} In case submited data is invalid
 * @returns {404} In case user does not exists
 * @returns {500} In case of any internal server error
 */
router.post("/verifyEmail", async (req, res) => {
  const { User } = require("../models");

  const body = { email: req.body.email };

  const { error, value } =
    authenticationValidationSchemas.verifyEmailPost.validate(body);

  if (error) return res.sendStatus(400);

  try {
    const user = await User.findOne({ email: value.email });

    if (user === null) throw new Error(404);
  } catch (error) {
    if (error.message === "404") {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }

  try {
    await emailVerification.start(value.email);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @name /verifyEmail-[GET]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Get user email verification link and use it to set user `emailVerified` property to `true`
 *
 * @requires User
 * @requires emailVerification
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {200} In case `emailVerified` property was successfully set to `true`
 * @returns {400} In case email verification token is invalid
 * @returns {403} In case email verification token expired
 * @returns {404} In case user does not exists
 * @returns {409} In case user `emailVerified` property is already set to `true`
 * @returns {500} In case of any internal server error
 */
router.get("/verifyEmail", async (req, res) => {
  const { User } = require("../models");

  const data = { token: req.query.token };

  try {
    const { error, value } =
      authenticationValidationSchemas.token.validate(data);

    if (error) throw new Error(error);

    data.token = value.token;
  } catch (error) {
    return res.sendStatus(400);
  }

  const body = {};

  try {
    const result = await emailVerification.check(data.token);

    body.email = result;
  } catch (error) {
    if (error.message === "400" || error.message === "403") {
      return res.sendStatus(error.message);
    }

    return res.sendStatus(500);
  }

  const { error, value } =
    authenticationValidationSchemas.verifyEmailGet.validate(body);

  if (error) return res.sendStatus(400);

  try {
    const user = await User.findOne({ email: value.email });

    if (user === null) throw new Error(404);

    if (user.emailVerified) throw new Error(409);

    try {
      await emailVerification.verifyEmail(user, data.token);
      return res.sendStatus(200);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error.message === "404" || error.message === "409") {
      return res.sendStatus(error.message);
    }

    res.sendStatus(500);
  }
});

/**
 * @name /resetPassword-[POST]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Send user reset password link through email
 *
 * @requires User
 * @requires resetPassword
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {200} In case password reset link was successfully sent
 * @returns {403} In case user `emailVerified` property is `false`
 * @returns {404} In case user does not exists
 * @returns {500} In case of any internal server error
 */
router.post("/resetPassword", async (req, res) => {
  const { User } = require("../models");

  const body = {
    email: req.body.email,
    newPassword: req.body.newPassword,
    newPasswordConfirmation: req.body.newPasswordConfirmation,
  };

  const { error, value } =
    authenticationValidationSchemas.resetPasswordPost.validate(body);

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const user = await User.findOne({ email: value.email });

    if (user === null) throw new Error(404);

    if (!user.emailVerified) throw new Error(403);
  } catch (error) {
    if (error.message === "404" || error.message === "403") {
      return res.sendStatus(error.message);
    }

    return res.sendStatus(500);
  }

  try {
    await resetPassword.start(value.email, value.newPassword);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 *
 * @name /resetPassword-[GET]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Get user reset email link and use it to set user `emailVerified` property to `true`
 *
 * @requires User
 * @requires resetPassword
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {200} In case user `hash` property was successfully overriden with the new password's hash
 * @returns {400} In case reset password JWT is invalid
 * @returns {403} In case reset password JWT expired
 * @returns {404} In case user does not exists
 * @returns {500} In case of any internal server error
 */
router.get("/resetPassword", async (req, res) => {
  const { User } = require("../models");

  const data = { token: req.query.token };

  try {
    const { error, value } =
      authenticationValidationSchemas.token.validate(data);

    if (error) throw new Error(error);

    data.token = value.token;
  } catch (error) {
    return res.sendStatus(400);
  }

  const body = {};

  try {
    const result = await resetPassword.check(data.token);

    body.email = result.email;
    body.newPassword = result.newPassword;
  } catch (error) {
    if (error.message === "400") {
      return res.sendStatus(400);
    }

    return res.sendStatus(500);
  }

  const { error, value } =
    authenticationValidationSchemas.resetPasswordGet.validate(body);

  if (error) return res.sendStatus(400);

  try {
    const user = await User.findOne({ email: value.email });

    if (user === null) throw new Error(404);

    if (user.emailVerified) throw new Error(403);

    try {
      await resetPassword.reset(user, value.newPassword, data.token);
      return res.sendStatus(200);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error.message === "404" || error.message === "403") {
      return res.sendStatus(error.message);
    }

    res.sendStatus(500);
  }
});

/**
 *
 * @name /logout-[GET]
 *
 * @function
 *
 * @memberof module:authentication
 *
 * @description Destroy user's auth session loggin him out
 *
 * @requires authorized
 *
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 *
 * @returns {200} In case user was successfully logged out
 * @returns {500} In case of any internal server error
 */
router.get("/logout", authorized, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.sendStatus(500);

    res.sendStatus(200);
  });
});

module.exports = router;
