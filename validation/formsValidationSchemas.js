const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");
const validationErrorMessages = require("../configs/clientErrorMessages/validationErrorMessages");

exports.create = joi
  .object({
    name: generalValidationSchema.name.required(),
    project: joi.string().alphanum().required(),
    author: joi.string().alphanum().required(),
  })
  .messages(validationErrorMessages.object);
