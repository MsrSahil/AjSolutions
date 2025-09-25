import { useState, useEffect, useMemo } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import Calendar from "./Admin/calender"; // Custom Calendar component

const UserDashboard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/getTasks", { withCredentials: true });
      setAllTasks(res.data.tasks || []);
      setJoinDate(res.data.joinDate); // User ki join date set karein
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sirf aaj ke tasks ko filter karein
  const tasksForToday = useMemo(() => {
    const todayStr = new Date().toDateString();
    return allTasks.filter(t => new Date(t.date).toDateString() === todayStr);
  }, [allTasks]);

  // ✅ Calendar ke liye har date ka status nikaalein
  const taskStatusByDate = useMemo(() => {
    const statusMap = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    allTasks.forEach(task => {
        const taskDate = new Date(task.date);
        const dateString = taskDate.toDateString();
        
        const isMissed = !task.completed && taskDate < today;

        // Agar uss date par pehle se 'Missed' hai, to use na badlein
        if (statusMap[dateString] === 'Missed') return;

        if (isMissed) {
            statusMap[dateString] = 'Missed';
        } else if (task.completed) {
            statusMap[dateString] = 'Submitted';
        }
    });
    return statusMap;
  }, [allTasks]);

  const handleSubmit = async (taskId) => {
    const answer = answers[taskId] || "";
    if (!answer.trim()) return toast.error("Please enter your answer");

    setLoading(true);
    try {
      await api.post(
        "/auth/taskSubmit",
        { answer, taskId },
        { withCredentials: true }
      );
      toast.success("Task submitted successfully!");
      setAnswers((prev) => ({ ...prev, [taskId]: "" }));
      fetchTasks(); // Task submit hone ke baad list refresh karein
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const handleNoCopyPaste = (e) => e.preventDefault();
  const handleInput = (taskId, value) => setAnswers((prev) => ({ ...prev, [taskId]: value }));

  const now = new Date();
  const allowed = now.getHours() >= 0 && now.getHours() < 19;

  return (
    <div className="bg-[#1F1F1F] min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-[#00BFA5] mb-6 text-center">
        User Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="w-full lg:w-1/3 bg-[#2C2C2C] p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Your Activity
          </h2>
          {/* Calendar ko zaroori data pass karein */}
          <Calendar taskStatusByDate={taskStatusByDate} joinDate={joinDate} />
        </div>

        {/* Task box */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {loading ? <p className="text-center text-[#9E9E9E]">Loading tasks...</p> : 
           tasksForToday.length > 0 ? (
            tasksForToday.map((task) => {
              const alreadySubmitted = taskStatusByDate[new Date(task.date).toDateString()] === 'Submitted';
              return (
                <div key={task._id} className="p-4 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0]">
                  <p className="font-medium">Task:</p>
                  <p className="mt-1 mb-3">{task.title}</p>

                  {!allowed ? (
                    <p className="text-center text-yellow-400">⏰ You can only submit tasks between 10AM – 7PM</p>
                  ) : alreadySubmitted ? (
                    <p className="text-center text-green-400">✅ You already submitted this task</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Enter your answer..."
                        value={answers[task._id] || ""}
                        onChange={(e) => handleInput(task._id, e.target.value)}
                        onCopy={handleNoCopyPaste} onCut={handleNoCopyPaste} onPaste={handleNoCopyPaste}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none"
                      />
                      <button onClick={() => handleSubmit(task._id)} disabled={loading} className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#00BFA5] text-[#1F1F1F] font-semibold hover:bg-[#E0E0E0] hover:text-[#1F1F1F] transition disabled:opacity-50">
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-[#9E9E9E] pt-16">No tasks assigned for today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;