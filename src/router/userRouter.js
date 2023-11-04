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
    const result = await createUser({ fName, lName, email });
    result.id
      ? res.json({
          status: true,
          result,
        })
      : res.json({
          status: false,
        });
  } catch (error) {
    res.json({
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
          message: "GET request to the homepage",
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
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
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
