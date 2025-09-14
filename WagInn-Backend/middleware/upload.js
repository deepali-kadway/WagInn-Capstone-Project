import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = ["uploads/property-photos", "uploads/id-verification"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration
//In Multer’s diskStorage, both destination and filename functions receive a callback (cb).
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.startsWith("propertyPhoto")) {
      cb(null, "uploads/property-photos");  //null if no error
    } else if (file.fieldname === "frontId" || file.fieldname === "backId") {
      cb(null, "uploads/id-verification");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    //generate unique filename
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);  //// 1 followed by 9 zeros
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + suffix + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });    //initialize Multer middleware, and store files as defined in diskStorage

export default upload;
