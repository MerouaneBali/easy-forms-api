var cryptoJS = require("crypto-js");

/**
 * @module crypto
 *
 * @category Utils
 *
 * @description Encrypts and decrypts messages using AES algorithm
 *
 * @requires crypto-js
 */

/**
 * @name encrypt
 *
 * @function
 *
 * @memberof module:crypto
 *
 * @description Encrypts a message using AES algorithm
 *
 * @requires crypto-js
 *
 * @param {string} message Message to be cyphered
 *
 * @returns {string} Encrypted message
 *
 * @throws {Error} CryptoJS error when encrypting message
 */
exports.encrypt = async (message) => {
  try {
    const cypher = cryptoJS.AES.encrypt(
      message,
      process.env.CRYPTO_SECRET
    ).toString();

    return cypher;
  } catch (error) {
    throw error;
  }
};

/**
 * @name decrypt
 *
 * @function
 *
 * @memberof module:crypto
 *
 * @description Decrypts a message using AES algorithm
 *
 * @requires crypto-js
 *
 * @param {string} message Message to be deciphered
 *
 * @returns {string} Decrypted message
 *
 * @throws {Error} CryptoJS error when decrypting message
 */
exports.decrypt = async (encrypted) => {
  try {
    const message = cryptoJS.AES.decrypt(
      encrypted,
      process.env.CRYPTO_SECRET
    ).toString(cryptoJS.enc.Utf8);

    return message;
  } catch (error) {
    throw error;
  }
};
