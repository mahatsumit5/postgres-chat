import { Router } from "express";
import { createUser, getAllUsers } from "../query/user.query";
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
router.post("/", async (req, res, next) => {
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

export default router;
