import { NextFunction, Response, Request } from "express";
import Joi from "joi";
import { z } from "zod";
const email = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();
const password = Joi.string()
  .pattern(
    new RegExp(
      `^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>?])(?=.*[a-zA-Z0-9])[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>?]{0,30}$`
    )
  )
  .min(8)
  .max(30);

const User = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .max(30, {
      message: "Password cannot be greater than 30 characters long.",
    }),
});
export const validateUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = Joi.object({
      email: email,
      password: password,
      fName: Joi.string().required().min(2).max(15),
      lName: Joi.string().required().min(2).max(15),
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const validateUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = Joi.object({
      email: email,
      password: password,
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
export const validatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = z.object({
      title: z
        .string()
        .min(1)
        .max(30, { message: "Title cannot be more than 30 characters." }),
      content: z
        .string()
        .min(1, { message: "Content should at least have one character." }),
      id: z.string({ required_error: "Author is required" }),
    });
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
