import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import AdminLogin from "./pages/Admin/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import Calender from "../src/pages/Admin/calender.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

          <Route path="/calender" element={<Calender />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
