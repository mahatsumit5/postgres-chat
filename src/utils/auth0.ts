import axios from "axios";
import { Response } from "express";
export const createAuth0Token = async (response: Response) => {
  const requestBody = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    audience: process.env.audience,
    grant_type: "client_credentials",
  };
  const { data } = await axios({
    method: "POST",
    url: process.env.Request_Token_URL,
    headers: { "content-type": "application/json" },
    data: requestBody,
  });

  // const cookieOptions = {
  //   secure: false,
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  // };
  // if (process.env.ENVIRONMENT !== "Development") cookieOptions.secure = true;
  // response.cookie("jwt", data.access_token, {
  //   ...cookieOptions,
  //   sameSite: "none",
  // });
  return data;
};
