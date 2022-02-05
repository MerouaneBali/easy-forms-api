const joi = require("joi");
const generalValidationSchema = require("./generalValidationSchema");

exports.register = joi.object({
  email: generalValidationSchema.email.required(),
  password: generalValidationSchema.password.required(),
  passwordConfirmation: generalValidationSchema.passwordConfirmation.required(),
});

exports.login = joi.object({
  email: generalValidationSchema.email.required(),
  password: generalValidationSchema.password.required(),
});

exports.verifyEmailPost = joi.object({
  email: generalValidationSchema.email.required(),
});

exports.verifyEmailGet = joi.object({
  email: generalValidationSchema.email.required(),
});

exports.resetPasswordPost = joi.object({
  email: generalValidationSchema.email.required(),
  newPassword: generalValidationSchema.password.required(),
  newPasswordConfirmation: generalValidationSchema.passwordConfirmation
    .valid(joi.ref("newPassword"))
    .required(),
});

exports.resetPasswordGet = joi.object({
  email: generalValidationSchema.email.required(),
  newPassword: joi.string().required(),
});

exports.token = joi.object({
  token: generalValidationSchema.token.required(),
});
