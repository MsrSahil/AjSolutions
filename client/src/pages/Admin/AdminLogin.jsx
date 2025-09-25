import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import { useAuth } from "../../context/AuthContext";
import api from "../../config/Api";

const AdminLogin = () => {
  
  //
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  

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
      const res = await api.post("/admin/adminlogin", formData);

      toast.success(res.data.message);
      // setUser(res.data.data);
      // setIsLogin(true);
      // sessionStorage.setItem("ChatUser", JSON.stringify(res.data.data));
      navigate("/admindashboard");
    } catch (error) {
      toast.error(
        `Error : ${error.response?.status || error.message} | ${
          error.response?.data.message || ""
        }`
      );
    }
  };

  return (
    <div className="bg-[#222831] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#393E46] rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#00ADB5] mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[#EEEEEE] font-medium mb-1">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              autoComplete="false"
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
              placeholder="Enter admin password"
              required
              className="w-full px-4 py-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#00ADB5] text-[#222831] font-semibold py-2 rounded-lg hover:bg-[#EEEEEE] hover:text-[#222831] transition"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
