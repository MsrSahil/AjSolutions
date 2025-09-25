// components/admin/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ✅ Sabhi users ko fetch karein
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

  // ✅ Chune gaye user ki details aur tasks fetch karein
  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    setSelectedUser(null); // Pehle purane user ki details hata dein
    setUserTasks([]);
    try {
      const res = await api.get(`/admin/user/${userId}`, { withCredentials: true });
      setSelectedUser(res.data.user || null);
      setUserTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Missed tasks ko filter karne ke liye function
  const getTaskStatus = (task) => {
    const taskDate = new Date(task.date);
    const today = new Date();
    // Task ki date agar aaj se purani hai aur complete nahi hua hai
    if (!task.completed && taskDate < today.setHours(0, 0, 0, 0)) {
      return 'Missed';
    }
    if (task.completed) {
      return 'Submitted';
    }
    return 'Pending'; // Agar future ka task hai jo complete nahi hua
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-3rem)]">
      {/* Left Side: Users List */}
      <div className="lg:w-1/3 bg-[#2C2C2C] rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#00BFA5] p-4 sticky top-0 bg-[#2C2C2C] z-10">All Users</h2>
        {loading ? (
          <p className="text-center text-[#E0E0E0] p-4">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-[#E0E0E0] p-4">No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => fetchUserDetails(user._id)}
                className={`cursor-pointer p-4 border-b border-gray-700 hover:bg-[#333333] transition ${
                  selectedUser?._id === user._id ? "bg-[#00BFA5] text-black" : "text-[#E0E0E0]"
                }`}
              >
                <p className={`font-medium ${selectedUser?._id === user._id ? "text-black" : "text-[#E0E0E0]"}`}>{user.fullName}</p>
                <p className={`text-sm ${selectedUser?._id === user._id ? "text-gray-800" : "text-[#9E9E9E]"}`}>{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side: User Details */}
      <div className="lg:w-2/3 bg-[#2C2C2C] rounded-lg p-6 shadow-md overflow-y-auto">
        {loadingDetails ? (
           <p className="text-[#9E9E9E] text-center mt-10">Loading user details...</p>
        ) : selectedUser ? (
          <div>
            <h3 className="text-xl font-semibold text-[#00BFA5] mb-3">
              User Details
            </h3>
            <div className="bg-[#333] p-4 rounded-lg mb-6">
                <p><span className="font-medium text-[#9E9E9E]">Name:</span> {selectedUser.fullName}</p>
                <p><span className="font-medium text-[#9E9E9E]">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium text-[#9E9E9E]">Status:</span> <span className={`font-bold ${selectedUser.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>{selectedUser.status}</span></p>
            </div>

            <h4 className="text-lg font-semibold mt-6 mb-3 text-[#00BFA5]">
              Assigned Tasks
            </h4>
            {userTasks.length === 0 ? (
              <p className="text-[#9E9E9E]">No tasks assigned to this user.</p>
            ) : (
              <ul className="space-y-3">
                {userTasks.map((task) => {
                  const status = getTaskStatus(task);
                  return (
                    <li
                      key={task._id}
                      className="bg-[#333] p-4 rounded-lg border-l-4"
                      style={{
                        borderColor: status === 'Submitted' ? '#22c55e' : status === 'Missed' ? '#ef4444' : '#6b7280'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-[#E0E0E0]">{task.title}</p>
                            <p className="text-sm text-[#9E9E9E] mt-1">
                                Assigned on: {new Date(task.date).toLocaleDateString()}
                            </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            status === 'Submitted' ? 'bg-green-500/20 text-green-400' :
                            status === 'Missed' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      {status === 'Submitted' && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                           <p className="text-sm text-[#9E9E9E]">Answer: <span className="text-gray-300">{task.answer}</span></p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-[#9E9E9E] text-center mt-10">
            👈 Select a user to view their task history
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;