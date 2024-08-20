import User from "../models/userModels.js";
import { errorHandler } from "../utils/Error.js";

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
  try {
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
