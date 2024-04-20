import { Router } from "express";
import { createUser, getAllUsers, getUserByEmail } from "../query/user.query";
import { comparePassword } from "../utils/bcrypt";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers((req.query.email as string) || "", "");
    users.length
      ? res.json({ status: true, data: users })
      : res.status(404).json({ message: "No user found.", status: "error" });
  } catch (error) {
    next(error);
  }
});
router.post("/sign-up", async (req, res, next) => {
  try {
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
        accessJWT: "",
        refreshJWT: "",
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
