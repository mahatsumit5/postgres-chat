import { Router } from "express";
import {
  changePassword,
  getAllUsers,
  updateUser,
  uploadProfileImage,
} from "../query/user.query";
import { hashPass } from "../utils/bcrypt";
import { createAccessJWT, verifyRefreshJWT } from "../utils/jwt";
import { loggedInUserAuth, upload } from "../middleware";
import { sessions } from "../..";
const router = Router();

router.get("/", loggedInUserAuth, async (req, res, next) => {
  try {
    const user = req.userInfo;
    user?.id
      ? res.json({ status: true, data: user })
      : res.status(404).json({ message: "No user found.", status: false });
  } catch (error) {
    next(error);
  }
});
router.get("/all-users", async (req, res, next) => {
  try {
    console.log(req.query);
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

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = req.userInfo;
    delete sessions[token as string];
    res.json({ status: true });
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
router.put("/reset-password", async (req, res, next) => {
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
router.put("/update-user", async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) throw new Error("Not authorized");

    const result = await updateUser(user.id, req.body);
    result?.id
      ? res.status(200).json({
          status: true,
          message: "user updated Changed",
          result,
        })
      : next(new Error("Unable to updpate user information"));
  } catch (error) {
    next(error);
  }
});

router.put(
  "/upload-profile",

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
