import multer from "multer";

// File ko server ki disk par temporarily save karne ke liye storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Files is folder mein save hongi
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File ka original naam rakhein
  },
});

export const upload = multer({ 
    storage, 
});