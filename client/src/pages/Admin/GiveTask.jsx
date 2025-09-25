// components/admin/GiveTask.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const GiveTask = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/allUsers", { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Select/Deselect user
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // ✅ Assign Task
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      return toast.error("Task title is required!");
    }
    if (selectedUsers.length === 0) {
      return toast.error("Please select at least one user!");
    }

    try {
      await api.post(
        "/admin/assignTask",
        {
          title: taskTitle,
          users: selectedUsers,
        },
        { withCredentials: true }
      );

      toast.success("Task assigned successfully!");
      setTaskTitle("");
      setSelectedUsers([]);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <div className="bg-[#2C2C2C] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#00BFA5] mb-6">
        Assign Task to Users
      </h2>

      {/* Task Form */}
      <form onSubmit={handleAssignTask} className="space-y-4">
        <div>
          <label className="block text-[#E0E0E0] mb-1">Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
            placeholder="Enter task/question"
          />
        </div>

        {/* User Selection */}
        <div>
          <h3 className="text-lg font-semibold text-[#00BFA5] mb-2">
            Select Users
          </h3>
          {loading ? (
            <p className="text-[#9E9E9E]">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-[#9E9E9E]">No users found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map((user) => (
                <label
                  key={user._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                    selectedUsers.includes(user._id)
                      ? "bg-[#00BFA5] border-[#00BFA5] text-black"
                      : "bg-[#333] border-gray-600 text-[#E0E0E0]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-[#00BFA5] text-black py-2 rounded-lg font-semibold hover:bg-[#00a98c] transition"
        >
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default GiveTask;
