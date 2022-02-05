exports.object = {
  "object.missing":
    "Can not submit empty form, at least one field must be populated",
};

exports.email = {
  // "string.base": "Email must only contain alphabetic characters",
  "string.empty": `Email field can not be empty`,
  "string.min": `Email should be between 3 and 25 characters long`,
  "string.max": `Email should be between 3 and 25 characters long`,
  //   "any.required": `Name is a required field.`,
};

exports.password = {
  "string.base":
    "Password must only contain alphanumeric characters, white space, and the following symbols: # | @ | ! | $ | _",
  "string.empty": `Password field can not be empty`,
  "string.min": `Password should be between 8 and 24 characters long`,
  "string.max": `Password should be between 8 and 24 characters long`,
};

exports.passwordConfrimation = {
  "any.only": "Passwords do not much",
  "string.base":
    "Password must only contain alphanumeric characters, white space, and the following symbols: # | @ | ! | $ | _",
  "string.empty": `Password confirmation field can not be empty`,
  "string.min": `Password should be between 8 and 24 characters long`,
  "string.max": `Password should be between 8 and 24 characters long`,
};

// exports.phonePrimary = {
//   "string.base": "Phone number is not valid.",
//   "string.pattern.base": "Phone number is not valid.",
//   "string.empty": `Phone number can't be an empty field.`,
//   "string.min": `Phone number has to be 10 characters long.`,
//   "string.max": `Phone number has to be 10 characters long.`,
//   "any.required": `Phone number is a required field.`,
// };
