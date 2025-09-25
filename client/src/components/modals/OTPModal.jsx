import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../../config/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OTPModal = ({ isOpen, onClose, callingPage, data }) => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  const [otp, setOtp] = useState("");

  const handleOTPSubmit = async () => {
    data.otp = otp; // Attach OTP to data
    console.log("OTP data:", data);

    try {
      let res;
      if (callingPage === "register") {
        res = await API.post("/auth/register", data);
      } else {
        res = await API.post("/auth/login", data);
        setUser(res.data.data);
        setIsLogin(true);
        sessionStorage.setItem("ChatUser", JSON.stringify(res.data.data));
      }

      toast.success(res.data.message);
      onClose();
      callingPage === "register" ? navigate("/login") : navigate("/dashboard");
    } catch (error) {
      toast.error(
        `Error : ${error.response?.status || error.message} | ${
          error.response?.data?.message || ""
        }`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-[#393E46] p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-[#00ADB5] mb-4 text-center">
          Enter OTP
        </h2>
        <input
          type="text"
          placeholder="One Time Password"
          className="w-full p-3 mb-4 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="w-full bg-[#00ADB5] text-[#222831] font-semibold py-2 rounded-lg hover:bg-[#EEEEEE] hover:text-[#222831] transition"
          onClick={handleOTPSubmit}
        >
          {callingPage === "register" ? "Verify & Register" : "Verify & Login"}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
