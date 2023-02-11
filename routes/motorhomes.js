const {Router} = require('express');
const {validationResult} = require('express-validator');
const MotorHome = require('../models/motorhome');
const auth = require('../middleware/auth');
const {motorHomeValidator} = require('../utils/validators');
const router = Router();

// Выводим в отдельную функцию проверку на наличие пользователя
function isOwner(motorHome, req) {
    return motorHome.userId.toString() === req.user._id.toString();
}

// Рендерим страницу со всеми товарами - Выводим список всех автодомов
router.get('/', async (req, res) => {
    // Создаем объект автодомов - достаем все автодома
    try {
        const motorHomes = await MotorHome.find()
            .populate('userId', 'email name')
            .select('price title img');
        // console.log(motorHomes);
        res.render('motorhomes', {
            title: 'Автодома - выбрать дом на колесах',
            isMotorHomes: true,
            // Передаем тот userId, который активный сейчас в сессии
            userId: req.user ? req.user._id.toString() : null,
            motorHomes
        });
    } catch (err) {
        console.log(err);
    }
});

// Обработчик по редактированию - создаем отдельную страницу для редактирования
router.get('/:id/edit', auth, async (req, res) => {
    // Проверяем, есть ли query параметр,позволяющий редактировать страницу
    if (!req.query.allow) {
        return res.redirect('/');
    };

    try {
        // Получаем объект motorHome
        const motorHome = await MotorHome.findById(req.params.id);
        // Запрещаем переход на страницу другим пользователям
        if (!isOwner(motorHome, req)) {
            return res.redirect('/motorhomes');
        };

        // Возвращаем страницу с редактированием
        res.render('motorhome-edit', {
            title: `Редактировать ${motorHome.title}`,
            motorHome
        });
    } catch (err) {
        console.log(err);
    }
});

// Обрабатываем запрос с изменениями
router.post('/edit', auth, motorHomeValidator, async (req, res) => {
    // Валидируем - проверяем на ошибки
    const errors = validationResult(req);
    const {id} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/motorhomes/${id}/edit?allow=true`)
    };

    try {
        delete req.body.id;
        const motorHome = await MotorHome.findById(id);
        if (!isOwner(motorHome, req)) {
            res.redirect('/motorhomes')
        }
        Object.assign(motorHome, req.body)
        await motorHome.save();
        res.redirect('/motorhomes');
    } catch (err) {
        console.log(err);
    }
})

// Удаление автодома
router.post('/remove', auth, async (req, res) => {
    try {
        await MotorHome.deleteOne({
            _id: req.body.id
        });
        res.redirect('/motorhomes');
    } catch (err) {
        console.log(err);
    }

})

// Выводим отдельно каждый автомобиль по id
router.get('/:id', async (req, res) => {
    try {
        const motorHome = await MotorHome.findById(req.params.id);
        res.render('motorhome', {
            layout: 'empty',
            title: `Автодом ${motorHome.title}`,
            motorHome
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;