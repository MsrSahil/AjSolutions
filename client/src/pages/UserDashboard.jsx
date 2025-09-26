import { useState, useEffect, useMemo } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import Calendar from "./Admin/calender"; // Calendar component ko import karein

const UserDashboard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Tasks aur join date fetch karne ke liye function
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/getTasks", { withCredentials: true });
        setAllTasks(res.data.tasks || []);
        setJoinDate(res.data.joinDate); // User ki join date set karein
      } catch (err) {
        toast.error("Failed to load your tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Sirf aaj ke tasks ko filter karein
  const tasksForToday = useMemo(() => {
    const todayStr = new Date().toDateString();
    return allTasks.filter(t => new Date(t.date).toDateString() === todayStr);
  }, [allTasks]);

  // ✅ Calendar ke liye har date ka status nikaalein
  const taskStatusByDate = useMemo(() => {
    const statusMap = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    allTasks.forEach(task => {
        const taskDate = new Date(task.date);
        const dateString = taskDate.toDateString();
        
        const isMissed = !task.completed && taskDate < today;

        if (statusMap[dateString] === 'Missed') return;

        if (isMissed) {
            statusMap[dateString] = 'Missed';
        } else if (task.completed) {
            statusMap[dateString] = 'Submitted';
        }
    });
    return statusMap;
  }, [allTasks]);

  // ✅ Task submit karne ka function
  const handleSubmit = async (taskId) => {
    const answer = answers[taskId] || "";
    if (!answer.trim()) return toast.error("Answer cannot be empty.");

    setIsSubmitting(true);
    try {
      const res = await api.post(
        "/auth/taskSubmit",
        { answer, taskId },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      // State mein se submitted task ko update karein
      setAllTasks(currentTasks => 
        currentTasks.map(task => 
          task._id === taskId ? { ...task, completed: true, answer } : task
        )
      );
      setAnswers((prev) => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoCopyPaste = (e) => e.preventDefault();
  const handleInput = (taskId, value) => setAnswers((prev) => ({ ...prev, [taskId]: value }));

  const now = new Date();
  const allowed = now.getHours() >= 10 && now.getHours() < 19;

  return (
    <div className="bg-[#1F1F1F] min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-[#00BFA5] mb-6 text-center">
        User Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="w-full lg:w-1/3 bg-[#2C2C2C] p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Your Activity Calendar
          </h2>
          <Calendar taskStatusByDate={taskStatusByDate} joinDate={joinDate} />
        </div>

        {/* Task box */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-[#9E9E9E] pt-16">Loading your tasks...</p>
          ) : tasksForToday.length > 0 ? (
            tasksForToday.map((task) => {
              const alreadySubmitted = task.completed;
              return (
                <div key={task._id} className="p-4 rounded-lg bg-[#2C2C2C] border border-gray-700 text-[#E0E0E0] shadow-md">
                  <p className="font-medium text-[#00BFA5]">Today's Task:</p>
                  <p className="mt-1 mb-3">{task.title}</p>

                  {task.attachmentUrl && (
                    <div className="mb-4">
                        <a 
                            href={task.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 transition"
                        >
                            📎 View Attachment
                        </a>
                    </div>
                  )}

                  {!allowed && !alreadySubmitted ? (
                    <p className="text-center text-yellow-400 p-4 bg-[#333] rounded-lg">⏰ You can only submit tasks between 10 AM – 7 PM</p>
                  ) : alreadySubmitted ? (
                    <div>
                      <p className="text-center text-green-400 mb-2 font-semibold">✅ You have already submitted this task.</p>
                      <div className="bg-[#1F1F1F] p-3 rounded-lg border border-gray-600">
                        <p className="text-sm text-gray-400">Your Answer:</p>
                        <p className="text-md whitespace-pre-wrap">{task.answer}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Enter your answer here..."
                        value={answers[task._id] || ""}
                        onChange={(e) => handleInput(task._id, e.target.value)}
                        onCopy={handleNoCopyPaste} onCut={handleNoCopyPaste} onPaste={handleNoCopyPaste}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#00BFA5] text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none"
                      />
                      <button onClick={() => handleSubmit(task._id)} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#00BFA5] text-[#1F1F1F] font-semibold hover:bg-[#E0E0E0] hover:text-[#1F1F1F] transition disabled:opacity-50 disabled:cursor-wait">
                        {isSubmitting ? "Submitting..." : "Submit Answer"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-[#9E9E9E] pt-16">
                <p className="text-3xl mb-2">🎉</p>
                <p>No tasks assigned for today. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;