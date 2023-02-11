const  {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    // Описываем товар и количество заказов этого товара
    motorHomes: [
        {
            motorHome: {
                type: Object,
                required: true
            },
            count: {
                type: Number,
                required: true
            }
        }
    ],
    // Описываем пользователя,который сделал этот заказ
    user: {
        name:String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    // Дата заказа
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Order', orderSchema);