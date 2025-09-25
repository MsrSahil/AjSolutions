import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Admin assigns this
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // User writes this (answer/solution)
    answer: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
