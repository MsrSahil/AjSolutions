import Task from "../models/task.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: "Admin logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all pending user registrations
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" }).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update user status (approve or reject)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (status === 'approved') {
      const user = await User.findByIdAndUpdate(userId, { status: 'approved' }, { new: true });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // --- Approve hone par User ko Email Bhejein ---
      const subject = "Account Approved! Welcome Aboard!";
      const message = `
        <p>Hi ${user.fullName},</p>
        <p>Congratulations! Your account has been approved by our admin.</p>
        <p>You can now log in and start using our platform.</p>
        <p>Thanks,</p>
        <p>The Team</p>
      `;
      sendEmail(user.email, subject, message);

      res.status(200).json({ success: true, message: "User approved successfully." });

    } else if (status === 'rejected') {
      const user = await User.findByIdAndDelete(userId);
       if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // --- Reject hone par User ko Email Bhejein ---
      const subject = "Update on Your Registration";
      const message = `
        <p>Hi ${user.fullName},</p>
        <p>We're sorry to inform you that after careful review, your registration has been rejected.</p>
        <p>If you believe this is a mistake, please contact our support team.</p>
        <p>Thanks,</p>
        <p>The Team</p>
      `;
      sendEmail(user.email, subject, message);

      res.status(200).json({ success: true, message: "User rejected and removed." });
    } else {
      res.status(400).json({ success: false, message: "Invalid status." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ getAllUserTasks aur getTaskDetails functions ko YAHAN SE HATA DIYA GAYA HAI

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    // --- SIRF APPROVED USERS KO FETCH KARNE KE LIYE FILTER ADD KAREIN ---
    const users = await User.find(
      { role: "user", status: "approved" },
      "fullName email photo"
    );
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
