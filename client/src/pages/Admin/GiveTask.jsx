import React, { useEffect, useState, useMemo } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const GiveTask = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [taskTitle, setTaskTitle] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Sirf 'approved' users ko fetch karein
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/allUsers", { withCredentials: true });
      // Yahaan user role = 'user' backend se hi filter hoke aa raha hai
      setAllUsers(res.data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search ke hisab se users filter karein
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return allUsers;
    }
    return allUsers.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);


  // --- User Selection Handlers ---
  const handleSelect = (userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.add(userId);
      return newSet;
    });
  };

  const handleDeselect = (userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };
  
  const handleSelectAll = () => {
    // Sirf filtered users ko select karein
    const allFilteredUserIds = filteredUsers.map(user => user._id);
    setSelectedUsers(new Set(allFilteredUserIds));
  };
  
  const handleDeselectAll = () => {
    setSelectedUsers(new Set());
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  // ✅ Task Assign Karne Ka Logic
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return toast.error("Task title is required!");
    if (selectedUsers.size === 0) return toast.error("Please select at least one user!");

    setIsAssigning(true);
    
    const formData = new FormData();
    formData.append("title", taskTitle);
    formData.append("users", JSON.stringify(Array.from(selectedUsers)));
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      await api.post("/admin/assignTask", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success("Task assigned successfully!");
      setTaskTitle("");
      setSelectedUsers(new Set());
      setAttachment(null);
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }
      setSearchTerm("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
    } finally {
      setIsAssigning(false);
    }
  };

  // UI ke liye selected aur available users ki list
  const selectedUsersList = allUsers.filter(user => selectedUsers.has(user._id));
  const availableUsersList = filteredUsers.filter(user => !selectedUsers.has(user._id));

  return (
    <div className="bg-[#2C2C2C] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#00BFA5] mb-6">Assign New Task</h2>

      <form onSubmit={handleAssignTask} className="space-y-6">
        {/* Task Title Input */}
        <div>
          <label className="block text-[#E0E0E0] mb-2 font-semibold">Task Title / Question</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
            placeholder="Enter the task you want to assign"
          />
        </div>
        
        {/* File Upload Input */}
        <div>
            <label className="block text-[#E0E0E0] mb-2 font-semibold">Attach File (Optional)</label>
            <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00BFA5] file:text-black hover:file:bg-[#00a98c] cursor-pointer"
            />
        </div>

        {/* User Selection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Available Users */}
          <div className="bg-[#1F1F1F] p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#00BFA5] mb-3">Available Users ({availableUsersList.length})</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-3 rounded-lg bg-[#333] border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00BFA5]"
            />
            <button type="button" onClick={handleSelectAll} className="w-full text-sm py-1 mb-3 text-[#00BFA5] hover:underline disabled:opacity-50" disabled={availableUsersList.length === 0}>
              Select All
            </button>
            <ul className="space-y-2 overflow-y-auto h-64 pr-2">
              {loading ? <p className="text-center">Loading Users...</p> : availableUsersList.map(user => (
                <li key={user._id} onClick={() => handleSelect(user._id)} 
                    className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-[#333]">
                  <span>{user.fullName}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel: Selected Users */}
          <div className="bg-[#1F1F1F] p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-[#00BFA5]">Selected Users ({selectedUsers.size})</h3>
                <button type="button" onClick={handleDeselectAll} className="text-sm text-red-400 hover:underline disabled:opacity-50" disabled={selectedUsers.size === 0}>
                    Clear All
                </button>
            </div>
            <ul className="space-y-2 overflow-y-auto h-[19.5rem] pr-2">
              {selectedUsersList.length > 0 ? selectedUsersList.map(user => (
                 <li key={user._id} onClick={() => handleDeselect(user._id)} 
                    className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-[#333]">
                  <span>{user.fullName}</span>
                  <button type="button" className="text-red-500 text-lg">&times;</button>
                </li>
              )) : <p className="text-center text-gray-500 pt-16">Click on a user from the left to select.</p>}
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAssigning || !taskTitle.trim() || selectedUsers.size === 0}
          className="w-full bg-[#00BFA5] text-black py-3 rounded-lg font-semibold hover:bg-[#00a98c] transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isAssigning ? "Assigning..." : `Assign Task to ${selectedUsers.size} User(s)`}
        </button>
      </form>
    </div>
  );
};

export default GiveTask;