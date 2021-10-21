const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const { signAccessToken } = require("../helpers/jwt_helper");
module.exports = {
  signup: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const doesExist = await User.findOne({ email: result.email });
      if (doesExist) throw createError.Conflict(`${result.email} is already been signed up`);

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);

      res.send({ accessToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not signed up");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) throw createError.Unauthorized("Username/password not valid");
      const accessToken = await signAccessToken(user.id);
      res.send({ accessToken, email: user.email, name: user.name });
    } catch (error) {
      if (error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
};
