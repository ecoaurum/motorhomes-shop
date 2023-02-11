const {Router} = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

// Рендерим страницу заказов
router.get('/', auth, async (req, res) => {
    try {
        // Получаем список всех заказов, относящиеся к нашему id
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')
        res.render('orders', {
            isOrder: true,
            title:'Заказы',
            // Формируем orders
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.motorHomes.reduce((total, m) => {
                        return total += m.count * m.motorHome.price
                    }, 0)
                }
            })
        });
    } catch (err) {
        console.log(err);
    }
});

// Создание заказа
router.post('/', auth, async (req, res) => {
    try {
        // При создании заказа сначала нам надо получить, все что есть в корзине
        const user = await req.user
            .populate('cart.items.motorHomeId')
            // .execPopulate()

        const motorHomes = user.cart.items.map(i => ({
            count: i.count,
            motorHome: {...i.motorHomeId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            motorHomes: motorHomes
        })
        //Сохраняем заказ
        await order.save();
        await req.user.clearCart();
        // Перенаправляем на страницу с заказами
        res.redirect('/orders');

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;