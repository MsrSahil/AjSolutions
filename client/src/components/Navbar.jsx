import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../config/Api";
import { HiOutlineLogout } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLogin, setUser, setIsLogin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Logo ke liye dynamic link
  const logoLink = isLogin
    ? user.role === "admin"
      ? "/admindashboard"
      : "/dashboard"
    : "/login";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      setUser(null);
      setIsLogin(false);
      sessionStorage.removeItem("ChatUser");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-[#222831] text-[#EEEEEE] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to={logoLink}
            className="text-2xl font-bold text-[#00ADB5] hover:text-[#EEEEEE] transition"
          >
            AJ-Solutions
          </Link>

          {/* Hamburger button (mobile only) */}
          <button
            className="md:hidden text-[#EEEEEE] hover:text-[#00ADB5] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <div
            className={`flex-col md:flex md:flex-row md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[#222831] md:bg-transparent transition-all duration-300 ${
              menuOpen ? "flex" : "hidden"
            } md:flex items-center`}
          >
            {/* Home aur Admin Login links yahan se hata diye gaye hain */}

            {isLogin && user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admindashboard" : "/dashboard"}
                  className="flex gap-3 items-center me-5 px-4 py-2 md:py-0"
                >
                  <img
                    src={user.photo}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span>{user.fullName.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 md:py-0 hover:text-[#00ADB5] transition font-medium"
                >
                  <span>Logout</span>
                  <HiOutlineLogout className="text-lg" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 md:py-0 hover:text-[#00ADB5] transition font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
