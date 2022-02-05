const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");
const validationErrorMessages = require("../configs/clientErrorMessages/validationErrorMessages");

exports.create = joi
  .object({
    name: generalValidationSchema.name.required(),
    author: joi.string().alphanum().required(),
  })
  .messages(validationErrorMessages.object);

exports.update = joi
  .object({
    project: joi.string().alphanum().required(),
    name: generalValidationSchema.name.required(),
  })
  .messages(validationErrorMessages.object);

exports.delete = joi
  .object({
    project: joi.string().alphanum().required(),
    author: joi.string().alphanum().required(),
  })
  .messages(validationErrorMessages.object);
