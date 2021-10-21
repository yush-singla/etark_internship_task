const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  name: Joi.string().min(4),
});

module.exports = {
  authSchema,
};
