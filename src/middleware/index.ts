import { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { getSession } from "../query/session.query";
export const loggedInUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const sessionsKeys = Object.keys(sessions);
    // if (!sessionsKeys.length) throw new Error("You are not logged in");
    // const loggedInUserIndex = sessionsKeys.findIndex(
    //   (token) => token === req.auth?.token
    // );

    // const email = Object.values(sessions)[loggedInUserIndex];
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(500).json({
        message: "You are not loggssed in",
      });
    }
    const user = await getSession(req.headers.authorization!);
    if (!user) {
      return res.status(401).json({ message: "You are not loaaaagged in" });
    }
    user.associate.password = undefined;
    user.associate.refreshJWT = undefined;
    req.userInfo = user.associate;

    return next();
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
