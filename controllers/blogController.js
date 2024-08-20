import mongoose from "mongoose";
import Blog from "../models/blogSchema.js";
import User from "../models/userModels.js";
import { errorHandler } from "../utils/Error.js";

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    if (!blogs) next(errorHandler(404, "No Blog found."));
    return res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};
export const getSingleBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) next(errorHandler(404, "No Blog found."));
    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};
export const createBlogs = async (req, res, next) => {
  const { title, content, user, image } = req.body;
  try {
    let existingUser = await User.findById(user);
    if (!existingUser)
      next(
        errorHandler(400, "User not found. Please provide a valid user ID.")
      );

    const newBlog = new Blog({ title, content, user, image });
    if (!newBlog) next(errorHandler(404, "Failed to create Blog."));

    const sesssion = await mongoose.startSession();
    sesssion.startTransaction();
    await newBlog.save({ sesssion });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ sesssion });
    await sesssion.commitTransaction();
    return res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
};
export const updateSingleBlog = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, user, image } = req.body;
  try {
    let blog = await Blog.findById(id);
    if (!blog) next(errorHandler(404, "No Blog found."));

    blog = await Blog.findByIdAndUpdate(
      id,
      {
        title: title || blog.title,
        content: content || blog.content,
        user: user || blog.user,
        image: image || blog.image,
      },
      { new: true }
    );
    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};
export const deleteSingleBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    if (!blog) next(errorHandler(404, "No Blog found."));
    return res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getBlogsByUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userblog = await User.findById(id).populate("blogs");
    if (!userblog) next(errorHandler(404, "No Blog found."));
    return res.status(200).json({
      blogs: userblog,
    });
  } catch (error) {
    next(error);
  }
};
