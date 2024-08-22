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

router.route("/").get(getBlogs);
router
  .route("/:id")
  .get(getSingleBlog)
  .post(createBlogs)
  .put(updateSingleBlog)
  .delete(deleteSingleBlog);

router.route("/user/:id").get(getBlogsByUser);

export default router;
