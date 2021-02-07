const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../../../public/uploads/'));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4 MB
  }
});

module.exports = uploadMiddleware;
