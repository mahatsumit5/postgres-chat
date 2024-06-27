import { Router, Response } from "express";
import {
  changePassword,
  createUser,
  getAllUsers,
  getUserByEmail,
  uploadProfileImage,
} from "../query/user.query";
import { comparePassword, hashPass } from "../utils/bcrypt";
import {
  createAccessJWT,
  createRefreshJWT,
  verifyRefreshJWT,
} from "../utils/jwt";
import { auth, upload, validateUserSignUp } from "../middleware";
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
      search ? search.toString().toLowerCase() : ""
    );

    users?.length
      ? res.status(200).json({ status: true, data: users, totalUsers })
      : res.status(400).json({ message: "No other user available" });
  } catch (error) {
    next(error);
  }
});
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
router.put("/reset-password", auth, async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) throw new Error("Not authorized");
    req.body.password = hashPass(req.body.password);

    const result = await changePassword({
      email: user.email,
      newPassword: req.body.password,
    });
    result
      ? res.status(200).json({
          status: true,
          message: "Password Changed",
        })
      : next(new Error("Unable to change your password"));
  } catch (error) {
    next(error);
  }
});

router.put(
  "/upload-profile",
  auth,
  upload.single("profile"),
  async (req, res, next) => {
    try {
      const user = req.userInfo;
      if (!user) throw new Error("Not authorized");
      const file = req.file as Express.MulterS3.File;
      const imagePath = file.location;

      const result = await uploadProfileImage(user.email, imagePath);
      result
        ? res.status(200).json({
            status: true,
            message: "Profile Image Uploaded",
            result,
          })
        : next(new Error("Unable to upload your profile image"));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
