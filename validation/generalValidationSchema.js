const joi = require("joi");
const validationErrorMessages = require("../configs/clientErrorMessages/validationErrorMessages");

const generalValidationSchema = {
  image: joi.string().uri().messages(),
  name: joi
    .string()
    .pattern(/^[a-zA-Z'\s]*$/)
    .lowercase()
    .min(3)
    .max(25)
    .messages(validationErrorMessages.name),

  email: joi.string().email().messages(validationErrorMessages.email),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9!@#_$\s]*$/)
    .min(8)
    .max(24)
    .messages(validationErrorMessages.password),
  passwordConfirmation: joi
    .string()
    .pattern(/^[a-zA-Z0-9!@#_$\s]*$/)
    .min(8)
    .max(24)
    .valid(joi.ref("password"))
    .messages(validationErrorMessages.passwordConfrimation),
  token: joi.string(),
  // .token(),
  // .regex(/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_.+/=]*$/),
};

module.exports = generalValidationSchema;
