// components/admin/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);

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

  // ✅ Fetch selected user details + tasks
  const fetchUserDetails = async (userId) => {
    try {
      const res = await api.get(`/admin/user/${userId}`, { withCredentials: true });
      setSelectedUser(res.data.user || null);
      setUserTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (userId) => {
    fetchUserDetails(userId);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Side: Users List */}
      <div className="lg:w-1/3 bg-[#2C2C2C] rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-[#00BFA5] p-4">All Users</h2>
        {loading ? (
          <p className="text-center text-[#E0E0E0]">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-[#E0E0E0]">No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
                className={`cursor-pointer p-4 border-b border-gray-700 hover:bg-[#333333] transition ${
                  selectedUser?._id === user._id ? "bg-[#444]" : ""
                }`}
              >
                <p className="font-medium text-[#E0E0E0]">{user.fullName}</p>
                <p className="text-sm text-[#9E9E9E]">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side: User Details */}
      <div className="lg:w-2/3 bg-[#2C2C2C] rounded-lg p-6 shadow-md">
        {selectedUser ? (
          <div>
            <h3 className="text-xl font-semibold text-[#00BFA5] mb-3">
              User Details
            </h3>
            <p>
              <span className="font-medium">Name:</span> {selectedUser.fullName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {selectedUser.email}
            </p>

            <h4 className="text-lg font-semibold mt-6 mb-3 text-[#00BFA5]">
              Submitted Tasks
            </h4>
            {userTasks.length === 0 ? (
              <p className="text-[#9E9E9E]">No tasks submitted by this user.</p>
            ) : (
              <ul className="space-y-3">
                {userTasks.map((task) => (
                  <li
                    key={task._id}
                    className="bg-[#333] p-3 rounded-lg border border-gray-700"
                  >
                    <p className="font-medium text-[#E0E0E0]">{task.title}</p>
                    <p className="text-sm text-[#9E9E9E]">
                      Submitted: {new Date(task.date).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-[#9E9E9E] text-center mt-10">
            👈 Select a user to view details
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;
