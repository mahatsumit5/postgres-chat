import { NextFunction, Request, Response } from "express";
import { verifyAccessJWT } from "../utils/jwt";
import { getUserByEmail } from "../query/user.query";
import multer, { Multer } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "error",
        message: "Not authorized",
      });
    }
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      const user = await getUserByEmail(decoded.email);
      if (user?.id) {
        user.password = undefined;
        user.refreshJWT = undefined;
        req.userInfo = user;
        return next();
      }
    }
  } catch (error: Error | any) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = "Your session has expired. Please login Again.";
    }
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

export const timeout = (req: Request, res: Response, next: NextFunction) => {
  const data = req.setTimeout(100000);
  setTimeout(() => res.send("Hello world!"), 10000);
};
