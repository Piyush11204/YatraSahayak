import multer from "multer";
import path from "path";  // For handling file extensions and paths

// Set up storage with dynamic file naming and destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");  // Set the storage location
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);  // Use a unique timestamp + original extension
  },
});

// File filter for image types (if you only want to allow image uploads)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"), false);
  }
};

// Middleware to handle image uploads with no limit on number or size
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,  // File filter for specific types
}).any();  // Accept any number of files in a request
