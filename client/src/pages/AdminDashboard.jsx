// pages/AdminDashboard.jsx
import React, { useState } from "react";
import Tasks from "./Admin/Task";
import Users from "./Admin/Users";
import GiveTask from "./Admin/GiveTask";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="flex min-h-screen bg-[#1F1F1F] text-[#E0E0E0]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#222831] shadow-lg flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-[#00BFA5] border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "tasks"
                ? "bg-[#00BFA5] text-black font-semibold"
                : "hover:bg-[#333333]"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            📋 Tasks
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "users"
                ? "bg-[#00BFA5] text-black font-semibold"
                : "hover:bg-[#333333]"
            }`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "giveTask"
                ? "bg-[#00BFA5] text-black font-semibold"
                : "hover:bg-[#333333]"
            }`}
            onClick={() => setActiveTab("giveTask")}
          >
            ➕ Give Task
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "tasks" && <Tasks />}
        {activeTab === "users" && <Users />}
        {activeTab === "giveTask" && <GiveTask />}
      </main>
    </div>
  );
};

export default AdminDashboard;
