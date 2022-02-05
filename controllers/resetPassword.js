const bcrypt = require("bcrypt");
const crypto = require("../utils/crypto");
const { DateTime } = require("luxon");

const { redisPasswordResetsClient } = require("../connections/redisConnection");

const tokenValidationSchema = require("../validation/tokenValidationSchema");

const sendMail = require("../utils/sendMail");

// const env = require("../configs/env");

/**
 * @module resetPassword
 * @category Controllers
 */

/**
 * @description Hash user's password and store it in redis resets cache,
 * generate a JWT with user's email as the content,
 * then send an email to the user containing the reset link
 *
 * @todo Prevent sending mutltiple different reset links
 * @todo Prevent using same link multiple times
 *
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires redisPasswordResetsClient
 * @requires sendEmail
 * @requires env
 *
 * @param {string} email User's email
 * @param {string} password User's new password
 *
 * @throws {bcrypt.error} Bcrypt error when hashing the new password
 * @throws {Redis.ReplyError} Redis error when setting new password hash using user's email as a key
 * @throws {jwt.NotBeforeError} JWT error when signing reset token
 * @throws {Error} Nodemailer error when sending email using @sendEmail
 */
exports.start = async (email, password) => {
  let newPassword = password;

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    newPassword = hash;
  } catch (error) {
    throw error;
  }

  let token = null;

  /** Encrypt token with JSON object (containing email & ex properties) */
  try {
    token = await crypto.encrypt(
      JSON.stringify({
        email: email,
        ex: DateTime.now().plus({
          seconds: process.env.RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
        }),
      })
    );
  } catch (error) {
    throw error;
  }

  /** Store key-value pair in redis where key is token and value is newPassword */
  try {
    await redisPasswordResetsClient.set(
      token,
      newPassword,
      "EX",
      process.env.RESET_PASSWORD_TOKEN_EXPIRATION_TIME
    );
  } catch (error) {
    throw error;
  }

  /** Encode token to URI */
  try {
    token = encodeURIComponent(token.toString("base64"));
  } catch (error) {
    throw error;
  }

  /** Send verification email */
  try {
    const recepient = email;
    const subject = "Easy Web Form - Reset Password";
    const htmlContent = `<a>http://localhost:${process.env.EXPRESS_PORT}/authentication/resetPassword/?token=${token}</a>`;

    const info = await sendMail(recepient, subject, htmlContent);

    return info;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Checks if given token is a JWT correctly signed by us, if so return its content
 *
 * @requires jsonwebtoken
 *
 * @param {string} token JWT
 *
 * @returns {Object} Decoded JWT content
 *
 * @throws {400} When catched local error is an instance of jwt.JsonWebTokenError
 * @throws {403} When catched local error is an instance of jwt.TokenExpiredError
 * @throws {Error} When catched local error is an instance of jwt.NotBeforeError
 */
exports.check = async (token) => {
  let message = null;

  /** Decrypt token to get message */
  try {
    message = await crypto.decrypt(decodeURIComponent(token));
  } catch (error) {
    throw new Error(400);
  }

  /** Convert message to JSON object */
  try {
    message = JSON.parse(message);
  } catch (error) {
    throw new Error(400);
  }

  const body = {};

  /** Validate if message has only the correct keys (email & ex)  */
  try {
    const { error, value } = tokenValidationSchema.token.validate(message);

    if (error) throw Error(400);

    body.email = value.email;
    body.ex = value.ex;
  } catch (error) {
    throw error;
  }

  /** Check if token is expired */
  try {
    if (DateTime.fromJSDate(body.ex).diffNow().milliseconds <= 0)
      throw Error(403);
  } catch (error) {
    throw error;
  }

  /** Return value of token from redis */
  try {
    const value = await redisPasswordResetsClient.get(token);

    if (!value) throw Error(400);

    return { email: body.email, newPassword: value };
  } catch (error) {
    throw error;
  }
};

/**
 * @description Resets user's password to the new hashed one stored in redis reset cache server
 *
 * @requires redisPasswordResetsClient
 *
 * @param {Object} user Mongoose user object
 *
 * @throws {Redis.ReplyError} Redis error when getting new password hash using user's email as a key
 * @throws {mongoose.Error} Mongoose error when saving user object after overriding it's hash property with the new password hash
 */
exports.reset = async (user, newPassword, token) => {
  try {
    await redisPasswordResetsClient.del(token);
  } catch (error) {
    throw error;
  }

  try {
    user.hash = newPassword;

    await user.save();
  } catch (error) {
    throw error;
  }
};
