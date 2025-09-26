import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    answer: { type: String, default: "" },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
    // --- YEH DO FIELDS ADD KAREIN ---
    attachmentUrl: { type: String, default: "" }, // File ka Cloudinary URL
    attachmentPublicId: { type: String, default: "" }, // File ko delete/manage karne ke liye
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
