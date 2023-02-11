const {body} = require('express-validator');
const User = require('../models/user');

//Валидация регистрации
exports.registerValidators = [
    // Валидируем поле email
    body('email')
        .isEmail().withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            try {
                //Проверяем, существует ли такой пользователь
                const user = await User.findOne({email: value}); // или req.body.email вместо value
                // Если существует, запрещаем регистрацию
                if  (user) {
                    return Promise.reject('Такой email уже занят');
                }
            } catch (err) {
                console.log(err);
            }
        })
        // Исправляет неправильный формат email прив воде данных при регистрации
        .normalizeEmail(),
    // Валидируем поле пароль
    body('password', 'Пароль должен быть минимум 7 символов')
        .isLength({min: 7, max: 54})
        .isAlphanumeric()
        // Удаляет лишние пробелы
        .trim(),
    // Валидируем поле "повторить пароль"
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать');
            } else {
                return true;
            }
        })
        .trim(),
    // Валидируем поле с именем
    body('name')
        .isLength({min: 3}).withMessage('Имя должно быть минимум три символа')
        .trim()
];

// Валидация входа в систему
// exports.loginValidators = [
//     body('email')
//         .isEmail().withMessage('Введите корректный email')
//         .custom(async (value, {req}) => {
//             const user = await User.findOne({email: value});
//                 if (value !== req.body.email) {
//                     throw new Error('Такого email не существует')
//                 } else {
//                     return true;
//                 }
//     })
//     .normalizeEmail(),
//     body('password')
//         .isAlphanumeric()
//         .custom((value, {req}) => {
//             if (value !== req.body.password) {
//                 throw new Error('Не корректный пароль. Повторите попытку');
//             } else {
//                 return true;
//             }
//         })
// ];

exports.motorHomeValidator = [
    body('title')
        .isLength({min: 3})
        .withMessage('Минимальная длинна названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img', 'Введите корректный URL картинки').isURL()
];