const Joi = require('@hapi/joi');

const signUpValidator = async (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
        .min(3)
        .required()
        .pattern(new RegExp(/^[^\s].+[^\s]$/))
        .messages({
            "any.required": "Fullname is required.",
            "string.empty": "Fullname cannot be an empty string.",
            "string.min": "Full name must be at least 3 characters long.",
            "string.pattern.base": "Full name cannot start or end with a whitespace.",
          }),
        phoneNumber: Joi.string()
        .length(11)
        .pattern(/^\d+$/)
        .required()
        .messages({
          "any.required": "Phone number is required.",
          "string.length": "Phone number must be exactly 11 digits.",
          "string.pattern.base": "Phone number must contain only numeric digits.",
        }),
        email: Joi.string().trim().email().messages({
            "any.required": "Please provide your email address.",
            "string.empty": "Email address cannot be left empty.",
            "string.email": "Invalid email format. Please use a valid email address.",
        }),
        password: Joi.string().required().pattern(new RegExp("^(?=.*[!@#$%^&])(?=.*[A-Z]).{8,}$")).messages({
            "any.required": "Please provide a password.",
            "string.empty": "Password cannot be left empty.",
            "string.pattern.base":
            "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
        }),
        address: Joi.string()
        .required()
        .trim()
        .messages({
        "string.base": "Customer address must be a string",
        "string.empty": "Customer address must not be an empty string",
        "any.required": "Customer address is required",
      }),
    })
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}

const logInValidator = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().messages({
            "any.required": "Please provide your email address.",
            "string.empty": "Email address cannot be left empty.",
            "string.email": "Invalid email format. Please use a valid email address.",
        }),
        password: Joi.string().required().pattern(new RegExp("^(?=.*[!@#$%^&])(?=.*[A-Z]).{8,}$")).messages({
            "any.required": "Please provide a password.",
            "string.empty": "Password cannot be left empty.",
            "string.pattern.base":
            "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
        }),
    })
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


module.exports = {signUpValidator, logInValidator}