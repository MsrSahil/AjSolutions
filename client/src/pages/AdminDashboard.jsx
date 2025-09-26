import React, { useState, useEffect } from "react";
import Users from "./Admin/Users";
import GiveTask from "./Admin/GiveTask";
import PendingApprovals from "./Admin/PendingApprovals";
import api from "../config/Api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("approvals");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Pending users ka count fetch karein
    const fetchCount = async () => {
        try {
            const res = await api.get('/admin/pending-users', { withCredentials: true });
            setPendingCount(res.data.users?.length || 0);
        } catch (error) {
            console.error("Failed to fetch pending count");
        }
    };
    fetchCount();
  }, [activeTab]); // Jab tab badle to count refresh ho

  return (
    <div className="flex min-h-screen bg-[#1F1F1F] text-[#E0E0E0]">
      <aside className="w-64 bg-[#222831] shadow-lg flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-[#00BFA5] border-b border-gray-700">Admin Panel</div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <button
            className={`w-full flex justify-between items-center text-left px-4 py-2 rounded-lg transition ${activeTab === "approvals" ? "bg-[#00BFA5] text-black font-semibold" : "hover:bg-[#333333]"}`}
            onClick={() => setActiveTab("approvals")}
          >
            <span>🔔 Pending Approvals</span>
            {pendingCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{pendingCount}</span>}
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "users" ? "bg-[#00BFA5] text-black font-semibold" : "hover:bg-[#333333]"}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "giveTask" ? "bg-[#00BFA5] text-black font-semibold" : "hover:bg-[#333333]"}`}
            onClick={() => setActiveTab("giveTask")}
          >
            ➕ Give Task
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "approvals" && <PendingApprovals />}
        {activeTab === "users" && <Users />}
        {activeTab === "giveTask" && <GiveTask />}
      </main>
    </div>
  );
};

export default AdminDashboard;