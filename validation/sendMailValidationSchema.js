const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");

exports.emailForm = joi
  .object({
    from: generalValidationSchema.email.required(),
    to: generalValidationSchema.email.required(),
    subject: joi.string().min(10).max(50).required(),
    text: joi.string().min(40).max(1000),
    html: joi.string(),
  })
  .xor("text", "html");
