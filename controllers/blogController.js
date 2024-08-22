import mongoose from "mongoose";
import Blog from "../models/blogSchema.js";
import User from "../models/userModels.js";
import { errorHandler } from "../utils/Error.js";

export const getBlogs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const blogs = await Blog.find({
      ...(req.query.userId && {
        userId: req.query.userId,
      }),
      ...(req.query.category && {
        category: req.query.category,
      }),
      ...(req.query.slug && {
        category: req.query.slug,
      }),
      ...(req.query.blogId && {
        _id: req.query.blofId,
      }),
      ...(req.query.searchterm && {
        $or: {
          title: { $regex: req.query.searchterm, $options: "i" },
          content: { $regex: req.query.searchterm, $options: "i" },
        },
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthBlogs = await Blog.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    if (!blogs) next(errorHandler(404, "No Blog found."));
    return res.status(200).json({
      blogs,
      totalBlogs,
      lastMonthBlogs,
    });
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
  const { title, content, category, image } = req.body;

  const { id } = req.params;

  try {
    let existingUser = await User.findById(id);

    if (!existingUser)
      next(
        errorHandler(400, "User not found. Please provide a valid user ID.")
      );

    if (!existingUser.isAdmin) {
      return next(errorHandler(403, "Unauthorized to create blog."));
    }

    if (!title || !content) {
      return next(errorHandler(404, " Please provide title and content."));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newBlog = await Blog.create({
      title,
      content,
      category,
      image,
      userId: existingUser._id,
      slug,
    });

    console.log(newBlog);

    if (!newBlog) next(errorHandler(404, "Failed to create Blog."));

    res.status(200).json(newBlog);
  } catch (error) {
    next(error);
  }
};

export const updateSingleBlog = async (req, res, next) => {
  const { id, blogId } = req.params;
  const { title, content, category, image } = req.body;
  try {
    let existingUser = await User.findById(id);

    if (!existingUser)
      next(
        errorHandler(400, "User not found. Please provide a valid user ID.")
      );

    if (!existingUser.isAdmin) {
      return next(errorHandler(403, "Unauthorized to create blog."));
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $set: {
          title,
          content,
          category,
          image,
        },
      },
      { new: true }
    );
    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};
export const deleteSingleBlog = async (req, res, next) => {
  const { id, blogId } = req.params;
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return next(
        errorHandler(400, "User not found. Please provide a valid user ID.")
      );
    }
    if (!existingUser.isAdmin) {
      return next(errorHandler(403, "Unauthorized to delete blog."));
    }
    const blog = await Blog.findByIdAndDelete(blogId);

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
