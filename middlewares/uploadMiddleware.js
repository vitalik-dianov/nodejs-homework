const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./tmp/avatars'));
  },
  filename: function (req, file, cb) {
    const [fileName, fileType] = file.originalname.split('.');
    cb(null, `${fileName}.${uuid.v4()}.${fileType}`);
  },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;
