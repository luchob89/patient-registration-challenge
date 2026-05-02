import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG images are accepted."));
    }
  },
});
