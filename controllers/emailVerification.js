const crypto = require("../utils/crypto");
const { DateTime } = require("luxon");

const {
  redisEmailVerificationClient,
} = require("../connections/redisConnection");

const tokenValidationSchema = require("../validation/tokenValidationSchema");

const sendMail = require("../utils/sendMail");
const genericEmailTemplate = require("../emails/genericEmailTemplate");

/**
 * @module emailVerification
 *
 * @category Controllers
 */

/**
 * @description Send user email verification link through email
 *
 * @requires sendEmail
 * @requires luxon
 * @requires crypto
 * @requires redisEmailVerificationClient
 * @requires sendMail
 *
 * @param {String} email User's email
 *
 * @throws {Error} CryptoJs error when encrypting data to generate token
 * @throws {Error} Redis error when storing token-email key-value pair
 * @throws {Error} Nodemailer error when sending email using @sendEmail
 */
exports.start = async (email) => {
  let token = null;

  /** Encrypt token with JSON object (containing email & ex properties) */
  try {
    token = await crypto.encrypt(
      JSON.stringify({
        email: email,
        ex: DateTime.now().plus({
          seconds: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME,
        }),
      })
    );
  } catch (error) {
    throw error;
  }

  /** Store key-value pair in redis where key is token and value is email */
  try {
    await redisEmailVerificationClient.set(
      token,
      email,
      "EX",
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME
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
    const subject = "Easy Forms - Email Verification";
    const pathname =
      "https://easy-forms-api.herokuapp.com/authentication/verifyEmail/";
    const html = genericEmailTemplate(pathname, token, {
      title: "Welcome to Easy Forms API",
      subtitle: "Click the `Verify Email` button to confirm your email",
      button: "Verify Email",
      small: "If the button above doesn't work, use the link below",
    });

    const info = await sendMail(recepient, subject, html);

    return info;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Send user email verification link through email
 *
 * @requires sendEmail
 * @requires luxon
 * @requires crypto
 * @requires redisEmailVerificationClient
 * @requires sendMail
 *
 * @param {String} email User's email
 *
 * @throws {Error} CryptoJs error when encrypting data to generate token
 * @throws {Error} Redis error when storing token-email key-value pair
 * @throws {Error} Nodemailer error when sending email using @sendEmail
 */
exports.startUpdate = async (email) => {
  let token = null;

  /** Encrypt token with JSON object (containing email & ex properties) */
  try {
    token = await crypto.encrypt(
      JSON.stringify({
        email: email,
        ex: DateTime.now().plus({
          seconds: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME,
        }),
      })
    );
  } catch (error) {
    throw error;
  }

  /** Store key-value pair in redis where key is token and value is email */
  try {
    await redisEmailVerificationClient.set(
      token,
      email,
      "EX",
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME
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
    const subject = "Easy Forms - Update Email";
    const pathname =
      "https://easy-forms-api.herokuapp.com/profile/update/newEmail/";
    const html = genericEmailTemplate(pathname, token, {
      title: "Update Your Easy Forms Account",
      subtitle:
        "Click the `Verify Email` button to confirm and update your account to this email",
      button: "Verify Email",
      small: "If the button above doesn't work, use the link below",
    });

    const info = await sendMail(recepient, subject, html);

    return info;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Checks if given token is a valid token signed by the API, and if so return its content
 *
 * @requires tokenValidationSchema
 * @requires luxon
 * @requires crypto
 * @requires redisEmailVerificationClient
 *
 * @param {String} token Token sent to you user before
 *
 * @returns {String} Value stored in redis corresponding to key token
 *
 * @throws {400} When token is invalid or doesn't exist in redis store
 * @throws {403} When token has expired
 * @throws {Error} When other errors occure
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
    const value = await redisEmailVerificationClient.get(token);

    if (!value) throw Error(400);

    return value;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Sets user emailVerified property to `true`
 *
 * @param {Object} user Mongoose user object
 * @param {String} token Email verification token sent to user before
 *
 * @throws {Error} Redis error when deleting token key
 * @throws {Error} Mongoose error when saving user object after overriding emailVerified property
 */
exports.verifyEmail = async (user, token) => {
  /** Delete key from redis */
  try {
    await redisEmailVerificationClient.del(token);
  } catch (error) {
    throw error;
  }

  /** Set user's `emailVerified` to `true` */
  try {
    user.emailVerified = true;
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * @description Sets user emailVerified property to `true`
 *
 * @param {Object} user Mongoose user object
 * @param {String} token Email verification token sent to user before
 *
 * @throws {Error} Redis error when deleting token key
 * @throws {Error} Mongoose error when saving user object after overriding emailVerified property
 */
exports.updateEmail = async (user, newEmail, token) => {
  /** Set user's `emailVerified` to `true` */
  try {
    user.email = newEmail;
    await user.save();
  } catch (error) {
    throw error;
  }

  /** Delete key from redis */
  try {
    newEmail = await redisEmailVerificationClient.del(token);
  } catch (error) {
    throw error;
  }
};
