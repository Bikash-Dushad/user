const Joi = require("joi");

const userRegisterValidator = Joi.object({
  userId: Joi.string().required().messages({
    "any.only": "User Id is required",
  }),
  phone: Joi.string().required().messages({
    "any.only": "Phone is required",
  }),
  name: Joi.string().allow("").optional(),
  email: Joi.string().allow("").optional(),
  gender: Joi.string().valid("male", "female", "other").optional().messages({
    "any.only": "gender must be male, female or other",
    "any.required": "gender is required",
  }),
  avatar: Joi.string().allow("").optional(),
});

module.exports = {
  userRegisterValidator,
};
