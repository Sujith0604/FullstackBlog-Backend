import User from "../models/userModels.js";
import { errorHandler } from "../utils/Error.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    next(error);
  }
};
export const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) next(errorHandler(404, "User not found."));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSingleUser = async (req, res, next) => {
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long.")
      );
    }
    req.body.password = await bcrypt.hash(
      req.body.password,
      process.env.SALT_ROUND
    );

    if (req.body.username.length < 6 || req.body.password.length > 20) {
      return next(
        errorHandler(
          400,
          "Username must be at least 6 characters long and password must be at most 20 characters long."
        )
      );
    }

    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain any spaces."));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profileImage: req.body.profileImage,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = updatedUser._doc;
    res.json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteSingleUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) next(errorHandler(404, "User not found."));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
