import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserByEmailAndUpdate,
  uploadProfileImage,
} from "../queries/userModel.js";
import { comparePassword, hashPass } from "../utils/bcrypt.js";
import {
  changePasswordValidation,
  loginValidation,
  newUserValidation,
} from "../utils/joiValidation.js";
import { createSession, findSessionAndDel } from "../queries/sessionModel.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { upload } from "../utils/multer.js";
import { createTokens } from "../utils/jwt.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", auth, (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: `Welcome back ${req.userInfo.fName} ${req.userInfo.lName}`,
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", newUserValidation, async (req, res) => {
  try {
    const { fName, lName, email, password } = req.body;
    if ((!fName || !lName || !email, !password)) {
      return res.json({
        status: "false",
        message: "Please provide all the required fields.",
      });
    }
    req.body.password = hashPass(password);

    const result = await createUser(req.body);
    result?.id
      ? res.json({
          status: true,
          message: "Account created sucessfully",
          result,
        })
      : res.json({
          status: false,
          message: "Unable to create user",
        });
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
});

router.post("/login-user", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (user?.id) {
      const isPasswordMatched = comparePassword(password, user.password);
      if (isPasswordMatched) {
        return res.json({
          status: "success",
          messgae: "password matched",
          tokens: await createTokens(user.email),
        });
      }

      return res.json({
        status: "error",
        message: "Incorrect password",
      });
    }
    res.json({
      status: "error",
      message: "No such User found",
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error.message,
    });
  }
});
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const users = await getAllUsers(email);

    users.length
      ? res.json({
          status: true,
          users,
        })
      : res.json({
          status: false,
          message: "No users found",
        });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

router.get("/reset-password/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    if (user?.id) {
      const obj = {
        uid: user.id,
        token: generateToken(),
      };
      const session = await createSession(obj);

      return res.json({
        status: "success",
        message: "Click the link below to reset your password",
        link: `${process.env.FRONTEND_URL}/reset-password?code=${obj?.token}&&e=${user.email}`,
      });
    }
    res.json({
      status: "error",
      message: "No user found with such email",
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/change-password",
  changePasswordValidation,
  async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      req.body.newPassword = hashPass(newPassword);
      const user = await changePassword(req.body);
      user?.id
        ? res.json({
            status: "success",
            message: "Password changed successfully",
          })
        : res.json({
            status: "error",
            message: "Password change failed",
          });
    } catch (error) {
      next(error);
    }
  }
);
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    res.json({
      result,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

router.put("/", auth, upload.single("profile"), async (req, res, next) => {
  try {
    if (req.file) {
      const user = await uploadProfileImage(req.body.email, req.file.path);
      user?.id
        ? res.json({
            status: "success",
            message: "Your image has been uploaded",
            user,
          })
        : res.json({
            status: "error",
            message: "Image upload failed",
          });
    }
  } catch (error) {
    next(error);
  }
});
router.put("/logout", async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT, email } = req.body;
    await findSessionAndDel(accessJWT, email);
    if (refreshJWT) {
      const user = await getUserByEmailAndUpdate(email, { refreshJWT: "" });
      user?.id &&
        res.json({
          status: "success",
          message: "Logged out successfully",
        });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
