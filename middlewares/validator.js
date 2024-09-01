const validator = require('@hapi/joi')

const schemas = {
    
    businessName:validator.string().min(3).required().pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
        "any.required": "Fullname is required.",
        "string.empty": "Fullname cannot be an empty string.",
        "string.min": "Full name must be at least 3 characters long.",
        "string.pattern.base": "Full name cannot start or end with a whitespace."
      }),
    fullName:validator.string().min(3).required().pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
        "any.required": "Fullname is required.",
        "string.empty": "Fullname cannot be an empty string.",
        "string.min": "Full name must be at least 3 characters long.",
        "string.pattern.base": "Full name cannot start or end with a whitespace."
      }),
    email:validator.string().email().required().messages({
        "any.required": "Email is required.",
        "string.email": "Invalid email format.",
      }),
    phoneNumber:validator.string()
    .length(11)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "any.required": "Phone number is required.",
      "string.length": "Phone number must be exactly 11 digits.",
      "string.pattern.base": "Phone number must contain only numeric digits."
      }),
      
    password:validator.string()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.pattern.base":
        "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",}),
    address:validator.string().required().regex(/^[a-zA-Z0-9-,\. ]+$/).messages({
        'string.pattern.base': 'Address can contain only alphabetic characters, numbers, spaces, or punctuations.',
        'any.required': 'Address is required.',
        'string.empty': 'Address cannot be empty.'
      }),
    newPassword:validator.string()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "string.pattern.base":
        "New password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*)."
      }),
    existingPassword:validator.string()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "string.pattern.base":
        "Existing password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*)."
      })
}

const midasValidator = (validateAllFields = false) => {
  return async (req, res, next) => {
      const keysToValidate = {};

      if (validateAllFields) {
          Object.keys(schemas).forEach((key) => {
              keysToValidate[key] = schemas[key].required();
          });
      } else {
          Object.keys(req.body).forEach((key) => {
              if (schemas[key]) {
                  keysToValidate[key] = schemas[key];
              }
          });
      }
      const schema = validator.object(keysToValidate);

      const { error } = schema.validate(req.body);

      if (error) {
          return res.status(400).json(error.details[0].message);
      } else {
          return next();
      }
  };
}

module.exports = midasValidator