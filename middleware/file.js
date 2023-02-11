// Отвечает за загрузку файлов

const multer = require('multer');

// Как будем загружать файлы на сервер
const storage = multer.diskStorage({
    // Куда сохраняем
    destination(req, file, cb) {
        cb(null, 'images');
    },
    // Имя файла меняем на текущую дату + имя файла
    filename(req, file, cb) {
        cb(null, new Date().toDateString() + '-' + file.originalname);
    }
});

// Допустимые форматы изображений
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

// Валидация файлов
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
});