import jwt from "jsonwebtoken";
import { createSession } from "../queries/sessionModel.js";
import { getUserByEmailAndUpdate } from "../queries/userModel.js";

export const createAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  await createSession({ token, email });
  return token;
};

export const verifyAccessJWt = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const createRefreshJWT = async (email) => {
  ///expires every 30days
  const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  await getUserByEmailAndUpdate(email, { refreshJWT: refreshJWT });
  return refreshJWT;
};

export const veifyRefreshAuth = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const createTokens = async (email) => {
  const token = {
    accessJWT: await createAccessJWT(email),
    refreshJWT: await createRefreshJWT(email),
  };
  return token;
};
