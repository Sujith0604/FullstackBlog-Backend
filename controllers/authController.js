import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/Error.js";

export const createUsers = async (req, res, next) => {
  const { username, email, password, blogs } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) next(errorHandler(404, "User already exists so please login"));

  const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUND);
  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      blogs: [],
    });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const loginUsers = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      next(errorHandler(404, "Could not find the user with this email"));

    const isPass = await bcrypt.compare(password, user.password);

    if (!isPass) next(errorHandler(404, "Incorrect password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);

    //res.status(200).json({ message: "Login Successful", data: user });
  } catch (error) {
    next(error);
  }
};
