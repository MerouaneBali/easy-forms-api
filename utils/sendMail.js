const { nodemailerClient } = require("../connections/nodemailerConnection");
const { htmlToText } = require("nodemailer-html-to-text");
const sendMailValidationSchema = require("../validation/sendMailValidationSchema");
const requiredArg = require("./requiredArg");

/**
 * @module sendMail
 *
 * @category Utils
 *
 * @description Send email using nodemailer Gmail transporter
 *
 * @requires nodemailerClient
 *
 * @param {string} recepient Recepient email address
 * @param {string} subject Email subject
 * @param {string} textContent Email text content
 * @param {string} htmlContent Email html content
 *
 * @returns {Object} Sent email info
 *
 * @throws {Error} Nodemailer error when sending email
 */
const sendMail = async (recepient, subject, htmlContent) => {
  const options = {
    from: process.env.GMAIL_ACCOUNT_USERNAME,
    to: recepient,
    subject: subject,
    html: htmlContent,
  };

  const { error, value } = sendMailValidationSchema.emailForm.validate(options);

  if (error) throw Error(error);

  try {
    await nodemailerClient.use("compile", htmlToText());

    const info = await nodemailerClient.sendMail(value);

    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = sendMail;
