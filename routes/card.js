const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
// const Card = require('../models/card');
const MotorHome = require('../models/motorhome');

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.motorHomeId._doc,
        id: c.motorHomeId.id,
        count: c.count
    }));
}

// Функция которая высчитывает цену в корзине
function computePrice(motorHomes) {
    return motorHomes.reduce((total, motorHome) => {
        return total += motorHome.price * motorHome.count
    }, 0)
}

// Добавление товара
router.post('/add', auth, async (req, res) => {
    // Принимаем в объекте request.body id того автодома, который нам необходимо добавить в корзину
    const motorHome = await MotorHome.findById(req.body.id);
    // Находим пользователя и добавляем товар в корзину
    await req.user.addToCart(motorHome);
    // После добавления в корзину товара, перенаправляем на страницу с корзиной
    res.redirect('/card');
});

// Удаление товара
router.delete('/remove/:id', auth, async (req, res) => {
    // const card = await Card.remove(req.params.id);
    await req.user.removeFromCart(req.params.id);
    // Отображаем заново корзину
    const user = await req.user.populate('cart.items.motorHomeId')//.execPopulate();
    const motorHomes = mapCartItems(user.cart);
    const cart = {
        motorHomes,
        price: computePrice(motorHomes)
    }
    res.status(200).json(cart);
});

// Обработчик
router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.motorHomeId')
        // .execPopulate();

    const motorHomes = mapCartItems(user.cart);

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        motorHomes: motorHomes,
        price: computePrice(motorHomes)
    });
});

module.exports = router; 