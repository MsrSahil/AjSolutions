import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import genToken from "../utils/auth.js";
import Task from "../models/task.js";

export const Register = async (req, res, next) => {
  try {
    const { fullName, email, password, otp } = req.body;

    const fetchOtp = await OTP.findOne({ email });
    if (fetchOtp) {
      const isOtpValid = await bcrypt.compare(otp.toString(), fetchOtp.otp);
      if (!isOtpValid) {
        const error = new Error("Invalid OTP");
        error.statusCode = 409;
        return next(error);
      }
      await OTP.deleteOne({ email });
    } else {
      const error = new Error("OTP Expired !!! Try Again.");
      error.statusCode = 404;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = `https://ui-avatars.com/api/?name=${fullName.charAt(
      0
    )}&background=random&color=fff&size=360`;

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      photo,
    });
    res.status(201).json({
      message: "Registration successful! Your account is pending admin approval.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // If 2FA is enabled, the OTP is now MANDATORY.
    if (existingUser.TwoFactorAuth) {
      if (!otp) {
        return res.status(401).json({ message: "OTP is required for this account." });
      }
      const fetchOtp = await OTP.findOne({ email });
      if (!fetchOtp) {
        return res.status(404).json({ message: "OTP has expired. Please try again." });
      }
      const isOtpValid = await bcrypt.compare(otp.toString(), fetchOtp.otp);
      if (!isOtpValid) {
        return res.status(401).json({ message: "Invalid OTP provided." });
      }
      await OTP.deleteOne({ email });
    }
    
    genToken(existingUser, res);

    res.status(200).json({
      message: "Login successful",
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
};

export const SendOTPForLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    
    // Check user's status before proceeding
    if (existingUser.status !== 'approved') {
      const message = existingUser.status === 'pending' 
        ? "Your account is pending admin approval."
        : "Your account has been rejected.";
      return res.status(403).json({ message });
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (!existingUser.TwoFactorAuth) {
      genToken(existingUser, res);
      return res.status(200).json({
        message: "Login successful (2FA not required)",
        data: existingUser,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp: hashedOtp });

    const subject = "Your Login OTP Code";
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0;">
              <h2 style="color: #333;">Msr Artrex Pvt. Ltd.</h2>
              <h1 style="color: #333; margin-bottom: 20px;">2-Step Verification Code</h1>
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                      Your verification code is:
                  </p>
                  <h2 style="font-size: 32px; color: #4CAF50; letter-spacing: 5px; margin: 20px 0;">
                      ${otp}
                  </h2>
                  <p style="font-size: 14px; color: #999; margin-top: 20px;">
                      This code will expire in 10 minutes. Please do not share this code with anyone.
                  </p>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  If you didn't request this code, please ignore this email.
              </p>
          </div>
      </div>
    `;
    sendEmail(email, subject, message);
    
    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    next(error);
  }
};

export const SendOTPForRegister = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      const error = new Error("Please fill all the fields");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      return next(error);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    await OTP.create({
      email,
      otp: hashedOtp,
    });
    
    const subject = "Verify your email";
    const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                <div style="text-align: center; padding: 20px 0;">
                    <h2 style="color: #333;">Msr Artrex pvt.ltd</h2>
                    <h1 style="color: #333; margin-bottom: 20px;">Email Verification Code</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                            Your verification code is:
                        </p>
                        <h2 style="font-size: 32px; color: #4CAF50; letter-spacing: 5px; margin: 20px 0;">
                            ${otp}
                        </h2>
                        <p style="font-size: 14px; color: #999; margin-top: 20px;">
                            This code will expire in 10 minutes. Please do not share this code with anyone.
                        </p>
                    </div>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        If you didn't request this code, please ignore this email.
                    </p>
                </div>
            </div>
        `;

    sendEmail(email, subject, message);
    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const Logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};

export const submitTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { taskId, answer } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!answer || answer.trim() === "") {
      return res.status(400).json({ message: "Answer is required" });
    }
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found for this user" });
    }

    if (task.completed) {
      return res.status(400).json({ message: "This task already submitted" });
    }

    task.answer = answer;
    task.completed = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({ user: userId }).sort({ date: 1 });

    res.status(200).json({ 
        success: true, 
        tasks,
        joinDate: req.user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};