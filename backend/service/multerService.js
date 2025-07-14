const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const allowedfileSize = process.env.ALLOWED_FILE_SIZE || '10mb';
// allowed types of files,
const allowedTypes = [
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/json',
    'application/pdf',
    'application/rtf',
];

// local storage  just for now, images are stored in uuid
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const uuid = uuidv4();
        cb(null, `${uuid}${fileExt}`);
    }
});
//10 mb limit for file upload
const multerConfig = multer({
    storage,
    limits: { fileSize: allowedfileSize },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('this is unsupported type,change the file type, please'));
        } else {
            cb(null, true);
        }
    },
});

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

module.exports = multerConfig;
