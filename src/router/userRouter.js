import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
} from "../queries/userModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fName, lName, email } = req.body;
    if (!fName || !lName || !email) {
      return res.json({
        status: "false",
        message: "Please provide all the required fields.",
      });
    }

    const result = await createUser({ fName, lName, email });
    result.id
      ? res.json({
          status: true,
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

router.get("/get-user/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params);
    user.id
      ? res.json({
          status: true,
          message: "user information",
          user,
        })
      : res.json({
          status: false,
          message: "No such User found",
        });
  } catch (error) {
    res.json({
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
