import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Helper function to sanitize and URL encode filenames for security
const sanitizeAndEncodeFilename = (originalName) => {
  // First sanitize: remove dangerous characters and normalize
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // Replace special chars with underscore
    .replace(/\.+/g, ".") // Replace multiple dots with single dot
    .replace(/^\./, "") // Remove leading dot
    .substring(0, 100); // Limit length to prevent long filename attacks

  // Then URL encode for safe storage and transmission
  return encodeURIComponent(sanitized);
};

// Helper function to decode filenames when serving/retrieving files
const decodeFilename = (encodedName) => {
  try {
    return decodeURIComponent(encodedName);
  } catch (error) {
    console.error("Error decoding filename:", error);
    return encodedName; // Return original if decoding fails
  }
};

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
      cb(null, "uploads/property-photos"); //null if no error
    } else if (file.fieldname === "frontId" || file.fieldname === "backId") {
      cb(null, "uploads/id-verification");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    //generate unique filename with timestamp and random number
    // const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9); //// 1 followed by 9 zeros
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);

    // Store original name separately, use UUID for actual filename
    const filename = `${file.fieldname}-${uniqueId}${ext}`;

    // Store metadata in file object for later use
    file.encodedOriginalName = sanitizeAndEncodeFilename(file.originalname);
    file.decodedOriginalName = file.originalname;
    file.secureFilename = filename;

    cb(null, filename);
  },
});

// File filter for additional security - only allow image files
const fileFilter = (req, file, cb) => {
  // Allowed MIME types for images
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  // Allowed file extensions
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  // Check both MIME type and file extension for security
  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only image files (JPG, PNG) are allowed."),
      false
    );
  }
};

// Initialize Multer middleware with enhanced security
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Add file type validation
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit to prevent DoS attacks
    files: 10, // Maximum 10 files per request
  },
});

// Middleware to add encoded/decoded file metadata to request object
export const addFileMetadata = (req, res, next) => {
  // Process multiple files (arrays)
  if (req.files && Array.isArray(req.files)) {
    req.files.forEach((file) => {
      file.safeOriginalName = decodeFilename(file.encodedOriginalName);
      file.urlSafePath = encodeURIComponent(file.path);
    });
  }

  // Process file objects (single files or multiple fields)
  if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
    Object.keys(req.files).forEach((fieldName) => {
      const files = req.files[fieldName];
      if (Array.isArray(files)) {
        files.forEach((file) => {
          file.safeOriginalName = decodeFilename(file.encodedOriginalName);
          file.urlSafePath = encodeURIComponent(file.path);
        });
      } else {
        files.safeOriginalName = decodeFilename(files.encodedOriginalName);
        files.urlSafePath = encodeURIComponent(files.path);
      }
    });
  }

  // Process single file
  if (req.file) {
    req.file.safeOriginalName = decodeFilename(req.file.encodedOriginalName);
    req.file.urlSafePath = encodeURIComponent(req.file.path);
  }

  next();
};

// Helper function to get safe file URL for serving files
export const getSafeFileUrl = (filePath) => {
  return encodeURIComponent(filePath);
};

// Helper function to decode file path when reading from database
export const getDecodedFilePath = (encodedPath) => {
  return decodeFilename(encodedPath);
};

export default upload;
