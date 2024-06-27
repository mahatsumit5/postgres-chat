import jwt from "jsonwebtoken";
import { createSession } from "../query/session.query";
import { getUserByEmailAndUpdate } from "../query/user.query";
import { jwtReturnType } from "../types";
export const createAccessJWT = async (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: 24 * 60 * 60 * 5, //5 days duration
  });
  await createSession({ token, email });

  return token;
};

export const verifyAccessJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as jwtReturnType;
};

export const createRefreshJWT = async (email: string) => {
  const refreshJWT = jwt.sign(
    { email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: 24 * 60 * 60 * 30, //30 days duration
    }
  );
  await getUserByEmailAndUpdate(email, { refreshJWT: refreshJWT });
  return refreshJWT;
};

export const verifyRefreshJWT = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as jwtReturnType;
};
export const createTokens = (email: string) => {
  return {
    accessJWT: createAccessJWT(email),
    refreshJWT: createRefreshJWT(email),
  };
};
