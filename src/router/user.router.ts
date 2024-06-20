import { Router, Response } from "express";
import { createUser, getAllUsers, getUserByEmail } from "../query/user.query";
import { comparePassword, hashPass } from "../utils/bcrypt";
import {
  createAccessJWT,
  createRefreshJWT,
  verifyRefreshJWT,
} from "../utils/jwt";
import { auth } from "../middleware";
import { findSessionAndDelete } from "../query/session.query";
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
router.get("/all-users", auth, async (req, res, next) => {
  try {
    const user = req.userInfo;
    const order = req.query.order as "asc" | "desc";
    const page = Number(req.query.page);
    const take = Number(req.query.take);
    const search = req.query.search;
    const { users, totalUsers } = await getAllUsers(
      user?.email || "",
      take,
      page,
      order,
      search ? search.toString() : ""
    );

    users?.length
      ? res.status(200).json({ status: true, data: users, totalUsers })
      : res.status(400).json({ message: "No other user available" });
  } catch (error) {
    next(error);
  }
});
router.post("/sign-up", async (req, res, next) => {
  try {
    req.body.password = hashPass(req.body.password);
    const user = await createUser(req.body);
    user.password = undefined;
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
    return res.json({
      status: true,
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

router.post("/logout", auth, async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = req.userInfo;

    const result = await findSessionAndDelete(
      token as string,
      user?.email || ""
    );
    result ? res.json({ status: true }) : next(new Error("Unable to logout"));
  } catch (error) {
    next(error);
  }
});

router.patch("/new-accessJWT", async (req, res, next) => {
  try {
    const result = verifyRefreshJWT(req.headers.refreshjwt as string);
    if (result?.email) {
      const token = await createAccessJWT(result.email);
      return res.json({
        status: true,
        data: token,
      });
    } else {
      return res.json({
        status: false,
        message: "Unexxpected error occured.",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
