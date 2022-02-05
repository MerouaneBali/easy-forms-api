const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");

exports.token = joi.object({
  email: generalValidationSchema.email.required(),
  ex: joi.date().required(),
});
