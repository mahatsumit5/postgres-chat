import Joi from "joi";
const shortString = Joi.string().min(2).max(15).required();
const email = Joi.string()

  .email({
    minDomainSegments: 2, //means needs to have @ and .
    tlds: { allow: ["com", "net"] }, //only allows com or net domain
  })
  .required();
const password = Joi.string().min(8).max(50).required();

export const newUserValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      fName: shortString,
      lName: shortString,
      email: email,
      password: password,
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const loginValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: email,
      password: password,
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const changePasswordValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: email,
      newPassword: password,
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
