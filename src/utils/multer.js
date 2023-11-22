import multer, { diskStorage } from "multer";
const imgFolderPath = "public/images/";
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgFolderPath);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
