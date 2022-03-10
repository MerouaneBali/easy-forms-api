const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const authorized = require("../middleware/authorized");

const profileValidationSchemas = require("../validation/profileValidationSchemas");

const emailVerification = require("../controllers/emailVerification");

/**
 * @module profile
 *
 * @category Routes
 *
 * @description Express router handling profile related requests
 *
 * @requires express
 */

/**
 * @name /-[GET]
 *
 * @function
 *
 * @memberof module:profile
 *
 * @description Get user's object
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {200} In case user is successfully fetched and returned
 * @returns {400} In case of validation error
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.get("/", authorized, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ email: user.email });
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @name /update-[POST]
 *
 * @function
 *
 * @memberof module:profile
 *
 * @description Updates user's object (send email verification link if user's `email` property is updated)
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {200} In case user is successfully updated
 * @returns {400} In case of validation error
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.post("/update", authorized, async (req, res) => {
  const { User } = require("../models");

  const body = {
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  };

  const { error, value } = profileValidationSchemas.update.validate(body);

  if (!body.email && !body.password) {
    return res.end();
  }

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const user = req.user;

    if (value.email) {
      try {
        const result = await User.exists({ email: value.email });

        if (result) throw new Error(409);
      } catch (error) {
        throw error;
      }

      try {
        await emailVerification.startUpdate(value.email);
      } catch (error) {
        throw error;
      }
    }

    if (value.password) {
      try {
        const hash = await bcrypt.hash(value.password, 10);

        value.hash = hash;
      } catch (error) {
        throw error;
      }

      try {
        user.hash = value.hash;

        await user.save();
      } catch (error) {
        throw error;
      }
    }

    return res.status(200).send({
      newEmail: Boolean(value.email),
      newPassword: Boolean(value.password),
    });
  } catch (error) {
    if (error.message === "409") {
      return res.sendStatus(409);
    }

    return res.sendStatus(500);
  }
});

/**
 * @name /updateEmail-[GET]
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
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {200} In case `email` property was successfully overriden and set to new email
 * @returns {400} In case update email verification token is invalid
 * @returns {403} In case update email verification token expired
 * @returns {409} In case user with new email already exists
 * @returns {500} In case of any internal server error
 */
router.get("/update/newEmail", authorized, async (req, res) => {
  const { User } = require("../models");

  const data = { token: req.query.token };

  try {
    const { error, value } = profileValidationSchemas.token.validate(data);

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
    profileValidationSchemas.verifyEmailGet.validate(body);

  if (error) return res.sendStatus(400);

  try {
    const result = await User.exists({ email: value.email });

    if (result) throw new Error(409);
  } catch (error) {
    if (error.message === "409") {
      return res.sendStatus(409);
    }

    console.log(error);
    return res.sendStatus(500);
  }

  try {
    const user = req.user;

    await emailVerification.updateEmail(user, value.email, data.token);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
