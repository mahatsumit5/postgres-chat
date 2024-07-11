import { NextFunction, Request, Response } from "express";
import { verifyAccessJWT } from "../utils/jwt";
import { getUserByEmail } from "../query/user.query";
import multer, { Multer } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import Joi from "joi";
import { sessions } from "../..";
export const loggedInUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionsKeys = Object.keys(sessions);
    if (!sessionsKeys.length) throw new Error("You are not logged in");
    const loggedInUserIndex = sessionsKeys.findIndex(
      (token) => token === req.auth?.token
    );

    const email = Object.values(sessions)[loggedInUserIndex];

    if (email) {
      const user = await getUserByEmail(email);
      if (user?.id) {
        user.password = undefined;
        user.refreshJWT = undefined;
        req.userInfo = user;

        return next();
      }
    }
  } catch (error: Error | any) {
    next(error);
  }
};

const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY as string;
const secretKey = process.env.AWS_SECRET_KEY as string;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});
export const upload = multer({
  storage: multerS3({
    s3,

    bucket: process.env.AWS_BUCKET_NAME as string,
    metadata: function (
      req: Request,
      file: Express.MulterS3.File,
      cb: Function
    ) {
      cb(null, { fieldName: file.filename });
    },
    key: function (req: Request, file: Express.MulterS3.File, cb: Function) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export const validateUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp(`^[a-zA-Z0-9!]{8,30}$`))
        .min(8)
        .max(30),
      fName: Joi.string().required().min(2).max(15),
      lName: Joi.string().required().min(2).max(15),
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const checkJwtAuth0 = () => {};
