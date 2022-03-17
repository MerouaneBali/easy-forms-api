const nodemailer = require("nodemailer");
const env = require("../configs/env");

const nodemailerClient = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ACCOUNT_USERNAME,
    pass: process.env.GMAIL_ACCOUNT_PASSWORD,
  },
});

module.exports = { nodemailerClient };
