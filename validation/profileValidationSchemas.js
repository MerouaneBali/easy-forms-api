const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");
const validationErrorMessages = require("../configs/clientErrorMessages/validationErrorMessages");

exports.update = joi
  .object({
    email: generalValidationSchema.email,
    password: generalValidationSchema.password,
    passwordConfirmation: generalValidationSchema.passwordConfirmation.valid(
      joi.ref("password")
    ),
  })
  .or("email", "password", "passwordConfirmation")
  .messages(validationErrorMessages.object);

exports.verifyEmailGet = joi.object({
  email: generalValidationSchema.email.required(),
});

exports.token = joi.object({
  token: generalValidationSchema.token.required(),
});
