import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
} from "../queries/userModel.js";
import { comparePassword, hashPass } from "../utils/bcrypt.js";
import { loginValidation, newUserValidation } from "../utils/joiValidation.js";
const router = express.Router();

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
    result.id
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
    const user = await getUserByEmail({ email });
    if (user?.id) {
      const isPasswordMatched = comparePassword(password, user.password);
      isPasswordMatched
        ? res.json({
            status: "success",
            messgae: "password matched",
            user,
          })
        : res.json({
            status: "error",
            message: "Incorrect password",
          });
      return;
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

export default router;
