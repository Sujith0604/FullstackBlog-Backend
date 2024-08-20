import express from "express";
import {
  createBlogs,
  deleteSingleBlog,
  getBlogs,
  getBlogsByUser,
  getSingleBlog,
  updateSingleBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.route("/").get(getBlogs).post(createBlogs);
router
  .route("/:id")
  .get(getSingleBlog)
  .put(updateSingleBlog)
  .delete(deleteSingleBlog);

router.route("/user/:id").get(getBlogsByUser);

export default router;
