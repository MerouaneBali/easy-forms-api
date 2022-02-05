const nodemailer = require("nodemailer");
const env = require("../configs/env");

const nodemailerClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT_USERNAME,
    pass: process.env.GMAIL_ACCOUNT_PASSWORD,
    // user: "trulyonehappyboy@gmail.com",
    // pass: "3H2^!v8E#qLQ",
  },
});

module.exports = { nodemailerClient };
