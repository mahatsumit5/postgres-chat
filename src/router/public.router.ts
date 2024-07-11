import { Response, Router } from "express";
import { validateUserSignUp } from "../middleware";
import { createUser, getUserByEmail } from "../query/user.query";
import { comparePassword, hashPass } from "../utils/bcrypt";
import { createAuth0Token } from "../utils/auth0";
import { sessions } from "../..";

const router = Router();

router.post("/sign-up", validateUserSignUp, async (req, res, next) => {
  try {
    const userAlreadyExist = await getUserByEmail(req.body.email);
    if (userAlreadyExist)
      throw new Error("An account already exist with this email.");
    req.body.password = hashPass(req.body.password);
    const user = await createUser(req.body);

    user?.id
      ? res.json({ status: true, message: "User Created" })
      : res.status(400).json({
          status: false,
          message: "Unable to create new account.Please try again.",
        });
  } catch (error) {
    next(error);
  }
});
router.post("/sign-in", async (req, res: Response, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      next(new Error("User not found"));
    }
    const isPasswordCorrect = comparePassword(req.body.password, user.password);
    if (!isPasswordCorrect) {
      next(new Error("Incorrect Password"));
    }
    const token = await createAuth0Token(res);
    sessions[token.access_token] = req.body.email;
    return res.json({
      status: true,
      message: "Logged In Successfully!",
      token: {
        accessJWT: token.access_token,
      },
    });
  } catch (error) {
    next(error);
  }
});
export default router;
