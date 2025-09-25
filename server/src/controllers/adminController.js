import Task from "../models/task.js";

// controllers/adminAuthController.js
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // check role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // send token as cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ success: true, message: "Admin logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all tasks
export const getAllUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user", "fullName email")
      .sort({ date: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get single task details
export const getTaskDetails = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "user",
      "fullName email"
    );
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "fullName email photo role createdAt");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get single user details with tasks
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const tasks = await Task.find({ user: user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      user,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Admin assigns a task (question) to multiple users
export const giveTask = async (req, res) => {
  try {
    const { title, users } = req.body;

    if (!title || !users || users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Title and users are required" });
    }

    const taskDocs = users.map((userId) => ({
      title,
      user: userId,
      date: new Date(),
      answer: "",
      completed: false,
    }));

    await Task.insertMany(taskDocs);

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
    });
  } catch (error) {
    console.error("Assign Task Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

