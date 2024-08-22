import express from "express";
import {
  deleteSingleUser,
  getSingleUser,
  getUsers,
  updateSingleUser,
} from "../controllers/userController.js";
import {
  createUsers,
  google,
  loginUsers,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(getUsers).post(createUsers);
router.route("/login").post(loginUsers);
router
  .route("/:id")
  .get(getSingleUser)
  .put(updateSingleUser)
  .delete(deleteSingleUser);

router.route("/google").post(google);
router.route("/logout").post(logout);
export default router;
