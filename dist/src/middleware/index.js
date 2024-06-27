"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSignUp = exports.timeout = exports.upload = exports.auth = void 0;
const jwt_1 = require("../utils/jwt");
const user_query_1 = require("../query/user.query");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const joi_1 = __importDefault(require("joi"));
const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || authorization === null) {
            return res.json({
                status: "error",
                message: "Not authorized",
            });
        }
        const decoded = (0, jwt_1.verifyAccessJWT)(authorization);
        if (decoded?.email) {
            const user = await (0, user_query_1.getUserByEmail)(decoded.email);
            if (user?.id) {
                user.password = undefined;
                user.refreshJWT = undefined;
                req.userInfo = user;
                return next();
            }
        }
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;
const s3 = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.filename });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});
const timeout = (req, res, next) => {
    const data = req.setTimeout(100000);
    setTimeout(() => res.send("Hello world!"), 10000);
};
exports.timeout = timeout;
const validateUserSignUp = async (req, res, next) => {
    try {
        console.log(req.body);
        const schema = joi_1.default.object({
            email: joi_1.default.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required(),
            password: joi_1.default.string()
                .pattern(new RegExp(`^[a-zA-Z0-9!]{8,30}$`))
                .min(8)
                .max(30),
            fName: joi_1.default.string().required().min(2).max(15),
            lName: joi_1.default.string().required().min(2).max(15),
        });
        await schema.validateAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateUserSignUp = validateUserSignUp;
