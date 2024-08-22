import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Userrouter from "./routes/userRoutes.js";
import Blogrouter from "./routes/blogRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser()); // parse cookies from request headers

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.use("/user", Userrouter);
app.use("/blog", Blogrouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  res.status(statusCode).json({
    succuess: false,
    message,
    statusCode,
  });
});

app.listen(process.env.PORT, () => {
  const port = process.env.PORT;
  console.log(`Server is running on port ${port}`);
});
