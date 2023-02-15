const {Router} = require('express');
const {validationResult} = require('express-validator');
const MotorHome = require('../models/motorhome');
const auth = require('../middleware/auth');
const {motorHomeValidator} = require('../utils/validators');
const router = Router();

// Добавить новый автодом
router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить автодом',
        isAdd: true
    });
});

// Обрабатываем POST запрос, который отвечает за обработчик формы при добавлении нового автомобиля 
router.post('/', auth, motorHomeValidator, async (req, res) => {
    // Валидируем
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить товар',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                description: req.body.description
            }
        })
    };

    const motorHome = new MotorHome({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        description: req.body.description,
        userId: req.user
    });

    try {
        await motorHome.save();
        res.redirect('/motorHomes');
    } catch (err) {
        console.log(err);
    }

});

module.exports = router;
