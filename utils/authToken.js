const jsonwebtoken = require("jsonwebtoken");
const crypto = require("./crypto");

/**
 * @module authToken
 *
 * @category Utils
 *
 * @description Signs and verifies encrypted JWT
 *
 * @requires jsonwebtoken
 * @requires crypto
 */

/**
 * @name sign
 *
 * @function
 *
 * @memberof module:authToken
 *
 * @description Sign JWT with `id` property containing encrypted user ID
 *
 * @requires crypto
 *
 * @param {string} message Message to be cyphered
 *
 * @returns {string} Encrypted message
 *
 * @throws {Error} CryptoJS error when encrypting message
 */
exports.sign = async (id) => {
  try {
    const cypher = await crypto.encrypt(id);

    try {
      const token = await jsonwebtoken.sign(
        { id: cypher },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.AUTHORIZATION_TOKEN_EXPIRATION_TIME * 1000,
        }
      );

      return token;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * @name sign
 *
 * @function
 *
 * @memberof module:authToken
 *
 * @description Verify JWT and decrypt `id` property containing encrypted user ID
 *
 * @requires crypto
 *
 * @param {string} message Deciphered user ID
 *
 * @returns {string} JWT token
 *
 * @throws {400} When catched local error is an instance of jsonwebtoken.JsonWebTokenError
 * @throws {403} When catched local error is an instance of jsonwebtoken.TokenExpiredError
 * @throws {Error} When catched local error is an instance of jsonwebtoken.NotBeforeError
 * @throws {Error} CryptoJS error when decrypting message
 */
exports.verify = async (token) => {
  try {
    const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET);

    try {
      const message = await crypto.decrypt(decoded.id);

      return message;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error(400);
    } else if (error.name === "TokenExpiredError") {
      throw new Error(403);
    }

    throw error;
  }
};
