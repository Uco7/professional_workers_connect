const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = [
            "image/jpg",
            "image/png",
            "image/jpeg",
        ];
        if (!allowedFileTypes.includes(file.mimetype)) {
            return cb(new Error("Only file types of png, jpg, jpeg are allowed and file size of 1MB"));
        }
        cb(null, true);
    }
});

const multipleImage = upload.fields([
    { name: "examAttendance", maxCount: 1 },
    { name: "examScore", maxCount: 1 }
]);

module.exports = multipleImage;
