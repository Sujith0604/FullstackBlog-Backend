import mongoose from "mongoose";
import Blog from "../models/blogSchema.js";
import User from "../models/userModels.js";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) return res.status(404).json({ message: "No Blog found." });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "No Blog found." });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const createBlogs = async (req, res) => {
  const { title, content, user, image } = req.body;
  try {
    let existingUser = await User.findById(user);
    if (!existingUser)
      return res.status(400).json({
        message: "User not found. Please provide a valid user ID.",
      });

    const newBlog = new Blog({ title, content, user, image });
    if (!newBlog)
      return res.status(404).json({ message: "Failed to create Blog." });

    const sesssion = await mongoose.startSession();
    sesssion.startTransaction();
    await newBlog.save({ sesssion });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ sesssion });
    await sesssion.commitTransaction();
    return res.status(201).json(newBlog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const updateSingleBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, user, image } = req.body;
  try {
    let blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "No Blog found." });
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
    return res.status(400).json({ error: error.message });
  }
};
export const deleteSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    if (!blog) return res.status(404).json({ message: "No Blog found." });
    return res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userblog = await User.findById(id).populate("blogs");
    if (!userblog) return res.status(404).json({ message: "No User found." });
    return res.status(200).json({
      blogs: userblog,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
