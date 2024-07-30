import { Router } from "express";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
export default router;
