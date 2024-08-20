import express from "express";
import {
  deleteSingleUser,
  getSingleUser,
  getUsers,
  updateSingleUser,
} from "../controllers/userController.js";
import { createUsers, loginUsers } from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(getUsers).post(createUsers);
router.route("/login").post(loginUsers);
router
  .route("/:id")
  .get(getSingleUser)
  .put(updateSingleUser)
  .delete(deleteSingleUser);

export default router;
