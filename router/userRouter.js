import { Router } from "express";
const router = new Router();

router.post("/", (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", (req, res) => {
  try {
    res.json({
      message: "GET request to the homepage",
    });
  } catch (error) {
    console.log(error);
  }
});
