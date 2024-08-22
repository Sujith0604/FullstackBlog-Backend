import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    image: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmailrelay.com%2Fen%2Fblog%2F2018%2F03%2F27%2Fwhat-is-a-blog-and-what-is-it-for%2F&psig=AOvVaw1X_T_9FwoDd1uJHvbUAR8Z&ust=1724380830745000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCRj6rJh4gDFQAAAAAdAAAAABAE",
    },
    userId: {
      type: "String",
      required: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
