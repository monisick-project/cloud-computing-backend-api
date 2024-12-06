import multer from "multer";
import path from "path";

// Konfigurasi multer untuk penyimpanan sementara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Direktori sementara
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Ekstensi file tetap
  },
});

const upload = multer({ storage });

export default upload; // Ekspor default
