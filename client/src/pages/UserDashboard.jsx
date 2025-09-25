import { useState, useRef, useEffect } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import Calendar from "../pages/Admin/calender"; // Custom Calendar component

const UserDashboard = () => {
  const [tasksForToday, setTasksForToday] = useState([]); // ✅ multiple tasks for today
  const [answers, setAnswers] = useState({}); // ✅ answers store per-task basis
  const [loading, setLoading] = useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = useState([]);

  // ✅ Fetch today's tasks & previously submitted tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/auth/getTasks", { withCredentials: true });
      const tasks = res.data.tasks || [];

      const todayStr = new Date().toDateString();
      const todayTasks = tasks.filter(
        (t) => new Date(t.date).toDateString() === todayStr
      );
      setTasksForToday(todayTasks);

      // Get submitted task IDs
      const submittedIds = tasks.filter((t) => t.completed).map((t) => t._id);
      setSubmittedTaskIds(submittedIds);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    }
  };

  const handleSubmit = async (taskId) => {
    const answer = answers[taskId] || "";
    if (!answer.trim()) return toast.error("Please enter your answer");

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/taskSubmit",
        { answer, taskId }, // ✅ backend me taskId bhi bhejna hoga
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setSubmittedTaskIds((prev) => [...prev, taskId]);
      setAnswers((prev) => ({ ...prev, [taskId]: "" }));

      fetchTasks();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const handleNoCopyPaste = (e) => e.preventDefault();

  const handleInput = (taskId, value) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  // ✅ Allowed time: 10AM – 7PM
  const now = new Date();
  const hours = now.getHours();
  const allowed = hours >= 10 && hours < 19;

  return (
    <div className="bg-[#1F1F1F] min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-[#00BFA5] mb-6 text-center">
        User Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="w-full lg:w-1/3 bg-[#2C2C2C] p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Calendar
          </h2>
          <Calendar submittedDates={submittedTaskIds} />
        </div>

        {/* Task box */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {tasksForToday.length > 0 ? (
            tasksForToday.map((task) => {
              const alreadySubmitted = submittedTaskIds.includes(task._id);

              return (
                <div
                  key={task._id}
                  className="p-4 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0]"
                >
                  <p className="font-medium">Task:</p>
                  <p className="mt-1 mb-3">{task.title}</p>

                  {!allowed ? (
                    <p className="text-center text-yellow-400">
                      ⏰ You can only submit tasks between 10AM – 7PM
                    </p>
                  ) : alreadySubmitted ? (
                    <p className="text-center text-green-400">
                      ✅ You already submitted this task
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Enter your answer..."
                        value={answers[task._id] || ""}
                        onChange={(e) =>
                          handleInput(task._id, e.target.value)
                        }
                        onCopy={handleNoCopyPaste}
                        onCut={handleNoCopyPaste}
                        onPaste={handleNoCopyPaste}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none"
                      />
                      <button
                        onClick={() => handleSubmit(task._id)}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#00BFA5] text-[#1F1F1F] font-semibold hover:bg-[#E0E0E0] hover:text-[#1F1F1F] transition disabled:opacity-50"
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-[#9E9E9E]">
              No tasks assigned for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
