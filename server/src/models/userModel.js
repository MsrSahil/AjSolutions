import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    photo: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // --- YEH FIELD ADD KAREIN ---
    TwoFactorAuth: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;