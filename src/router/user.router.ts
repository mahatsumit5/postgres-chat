import { Router } from "express";
import { createUser, getAllUsers, getUserByEmail } from "../query/user.query";
import { comparePassword, hashPass } from "../utils/bcrypt";
import { createAccessJWT, createRefreshJWT } from "../utils/jwt";
import { auth } from "../middleware";
const router = Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const user = req.userInfo;
    user?.id
      ? res.json({ status: true, data: user })
      : res.status(404).json({ message: "No user found.", status: false });
  } catch (error) {
    next(error);
  }
});
router.post("/sign-up", async (req, res, next) => {
  try {
    req.body.password = hashPass(req.body.password);
    const user = await createUser(req.body);
    user?.id
      ? res.json({ status: true, message: "User Created", data: user })
      : res.status(400).json({
          status: false,
          message: "Bad Request",
        });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.json({
        status: "error",
        message: "User not Found with that email",
      });
    }

    const isPasswordCorrect = comparePassword(req.body.password, user.password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.json({
        status: "error",
        message: "Incorrect Password",
      });
    }
    return res.json({
      status: "success",
      message: "Logged In Successfully!",
      token: {
        accessJWT: await createAccessJWT(req.body.email),
        refreshJWT: await createRefreshJWT(req.body.email),
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
