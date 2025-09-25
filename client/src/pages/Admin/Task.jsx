// components/admin/Tasks.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/admin/allTasks", { withCredentials: true });
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Side: Tasks Table */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold text-[#00BFA5] mb-4">All Tasks</h2>
        {loading ? (
          <p className="text-center text-[#E0E0E0]">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-[#E0E0E0]">No tasks submitted yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-[#2C2C2C] rounded-lg">
              <thead className="bg-[#00BFA5] text-[#1F1F1F] sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Task</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className={`cursor-pointer border-b border-gray-700 hover:bg-[#333333] transition ${
                      index % 2 === 0 ? "bg-[#2C2C2C]" : "bg-[#262626]"
                    }`}
                  >
                    <td className="py-2 px-4">{task.user?.fullName}</td>
                    <td className="py-2 px-4">{task.user?.email}</td>
                    <td className="py-2 px-4 truncate max-w-[200px]">{task.title}</td>
                    <td className="py-2 px-4">
                      {new Date(task.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Side: Task Details */}
      <div className="lg:w-1/3 bg-[#2C2C2C] rounded-lg p-4 shadow-md">
        {selectedTask ? (
          <div>
            <h3 className="text-xl font-semibold text-[#00BFA5] mb-3">
              Task Details
            </h3>
            <p>
              <span className="font-medium text-[#E0E0E0]">User:</span>{" "}
              {selectedTask.user?.fullName}
            </p>
            <p>
              <span className="font-medium text-[#E0E0E0]">Email:</span>{" "}
              {selectedTask.user?.email}
            </p>
            <p>
              <span className="font-medium text-[#E0E0E0]">Task:</span>{" "}
              {selectedTask.title}
            </p>
            <p>
              <span className="font-medium text-[#E0E0E0]">answer:</span>{" "}
              {selectedTask.answer}
            </p>
            <p>
              <span className="font-medium text-[#E0E0E0]">Task given at:</span>{" "}
              {new Date(selectedTask.date).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-[#9E9E9E] text-center mt-10">
            👈 Select a task to view details
          </p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
