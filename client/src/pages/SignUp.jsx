import React, { useState } from "react";
import { Link } from "react-router-dom";
import OTPModal from "../components/modals/OTPModal";
import toast from "react-hot-toast";
import api from "../config/Api";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add registration logic here
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } 
    console.log("Register form submitted:", formData);

    try {
      const res = await api.post("/auth/sendOtpRegister", formData);
      toast.success(res.data.message);
      setIsOTPModalOpen(true);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        `Error : ${error.response?.status || error.message} | ${
          error.response?.data.message || ""
        }`
      );
    }
  };

  return (
    <>
      <div className="bg-[#222831] min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#393E46] rounded-xl shadow-lg w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-[#00ADB5] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#EEEEEE] font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#EEEEEE] font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#EEEEEE] font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="false"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#EEEEEE] font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="false"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#00ADB5] text-[#222831] font-semibold py-2 rounded-lg hover:bg-[#EEEEEE] hover:text-[#222831] transition"
            >
              Sign Up
            </button>
          </form>

          {/* Already have account */}
          <p className="text-center text-[#EEEEEE] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00ADB5] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        callingPage="register"
        data={formData}
      />
    </>
  );
};

export default Signup;
