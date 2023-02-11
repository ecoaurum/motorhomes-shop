const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // генерирует рандомный пароль
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const keys = require('../keys');
const User = require('../models/user');
const regEmail = require('../emails/registrations');
const {registerValidators, loginValidators} = require('../utils/validators');
const resetEmail = require('../emails/reset');

// Email транспортер
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: 'adwordsmytest@gmail.com',
        pass: 'ukqoimtbewkbigyq'
    }
});

// Страница логина - авторизация
router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
});
// Страница logout - выход из системы
router.get('/logout', (req, res) => {
    // Очищаем сессию
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })
});

// Добавление сессии
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Определяем, существует ли такой пользователь
        const candidate = await User.findOne({email});
        // Если пользователь нашелся
        if (candidate) {
            // Проверяем пароли на совпадение
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                // Сохранение сессии
                req.session.save((err) => {
                    if(err) {
                        throw err;
                    } else {
                        res.redirect('/');
                    }
                })
            } else {
                req.flash('loginError', 'Неверный пароль');
                res.redirect('/auth/login#login');
            }
        } 
        else {
            //Если такого пользователя не существует
            req.flash('loginError', 'Такого пользователя не существует');
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }
});

// Регистрация пользователя
router.post('/register', registerValidators, async (req, res) => {
    try {
        // Обрабатываем данные, полученные из формы во время регистрации
        const {email, password, name} = req.body;

        // Проверяем, есть ли такой пользователь по email
        // const candidate = await User.findOne({ email }); - данная проверка уже не нужна,так как будем проверять отдельном файле validators.js

        // Валидация. Проверка на ошибки
        const errors = validationResult(req);
        // Если ошибка есть
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        };
        // Шифрование пароля
        const hashPassword = await bcrypt.hash(password, 7);
        // Если такого пользователя нет, создаем его, то есть регистрируем
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: {items: []}
        })
        // Сохраняем пользователя
        await user.save();
        res.redirect('/auth/login#login');
        // Отправляем письмо пользователю об успешной регистрации аккаунта
        await transporter.sendMail(regEmail(email));
    } catch (err) {
        console.log(err);
    }
});

// Восстановление пароля
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль???',
        // Если есть ошибка
        error: req.flash('error')
    })
});

// Страница нового пароля
router.get('/password/:token', async (req, res) => {
    // Если нет токена, просто перенаправляем на страницу логина
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            // Убеждаемся, что resetToken все еще валидный
            resetTokenExp: {$gt: Date.now()}
        });
        // Если такого пользователя нет
        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                // Если есть ошибка
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
    } catch (err) {
        console.log(err);
    }
});

// Восстановление пароля метод post
router.post('/reset', (req, res) => {
    try {
        // Генерируем ключь
        crypto.randomBytes(32, async (err, buffer) => {
            //Если ошибка, и не получилось сгенерировать ключ
            if (err) {
                req.flash('error', 'Что то пошло не так. Повторите попытку позже');
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            // Сравниваем email полученый от клиента с БД
            const candidate = await User.findOne({email: req.body.email});
            //Если email найден, то отправляем письмо
            if (candidate) {
                candidate.resetToken = token;
                // Устанавливаем время жизни токена 1 час
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                // Сохраняем кандидата
                await candidate.save();
                // После этого отправляем ему письмо
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет');
                res.redirect('/auth/reset');
            }
        })
    } catch (err) {
        console.log(err);
    }
});

// Изменение пароля
router.post('/password', async (req, res) => {
    try {
        // Проверяем, существует ли такой пользователь
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        });
        // Если пользователь нашелся
        if (user) {
            // Шифруем новый пароль
            user.password = await bcrypt.hash(req.body.password, 7);
            // После этого удаляем все данные, которые относятся к токену восстановления
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            // Сохраняем пользователя
            await user.save();
            res.redirect('/auth/login');
        } else {
            // Если нет такого пользователя
            req.flash('loginError', 'Время жизни токена истекло');
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;