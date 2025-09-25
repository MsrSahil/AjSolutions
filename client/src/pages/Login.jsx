import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPModal from "../components/modals/OTPModal";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    // Add login logic here
    console.log("Login form submitted:", formData);
    try {
      const res = await api.post("/auth/sendOtpLogin", formData);

      if (res.data.message === "OTP sent successfully") {
        setIsOTPModalOpen(true);
      } else {
        toast.success(res.data.message);
        setUser(res.data.data);
        setIsLogin(true);
        sessionStorage.setItem("ChatUser", JSON.stringify(res.data.data));
        navigate("/dashboard");
      }
    } catch (error) {
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
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
              Login
            </button>
          </form>

          {/* Don’t have an account? */}
          <p className="text-center text-[#EEEEEE] mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#00ADB5] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        callingPage="login"
        data={formData}
      />
    </>
  );
};

export default Login;
