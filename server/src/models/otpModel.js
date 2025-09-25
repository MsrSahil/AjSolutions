import mongoose from "mongoose";

const OtpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, //time in Seconds
    },
  },
  {
    timestamps: true,
  }
);
const OTP = mongoose.model("OTP", OtpSchema);
export default OTP;
