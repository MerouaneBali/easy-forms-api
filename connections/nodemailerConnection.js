const nodemailer = require("nodemailer");
const env = require("../configs/env");

const nodemailerClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_ACCOUNT_USERNAME,
    pass: process.env.GMAIL_ACCOUNT_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

module.exports = { nodemailerClient };
