import User from "../models/userModels.js";
import bcrypt from "bcrypt";

const saltRound = 12;

export const createUsers = async (req, res) => {
  const { username, email, password, blogs } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser)
    return res
      .status(404)
      .json({ message: "User already exists so please login" });
  const hashedPassword = await bcrypt.hash(password, saltRound);
  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      blogs: [],
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUsers = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "Could not find the user with this email" });

    const isPass = await bcrypt.compare(password, user.password);

    if (!isPass) res.status(404).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login Successful", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
