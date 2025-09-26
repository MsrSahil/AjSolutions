import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// .env file se credentials lekar Cloudinary ko configure karein
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // File ko Cloudinary par upload karein
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // File ka type automatically detect karega
    });
    // File upload hone ke baad server se temporary file ko delete kar dein
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Agar upload fail hota hai to temporary file ko delete kar dein
    fs.unlinkSync(localFilePath); 
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export default uploadOnCloudinary;