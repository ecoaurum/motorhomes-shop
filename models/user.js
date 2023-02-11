const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    // Устанавливаем поля,которые должны быть у нового пользователя
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    // URL аватара
    avatarUrl: String,
    // Токен для восстановления пароля
    resetToken: String,
    // Время жизни токена при восстановлении пароля
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                motorHomeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'MotorHome', // <- связываем с моделью в models/motorhome.js
                    required: true
                }
            }
        ]
    }
});

// Добавление товара в корзину
userSchema.methods.addToCart = function(motorHome) {
    // Обращаемся к корзине, забираем поля count и motorHomeId
    const items = [...this.cart.items];
    // Находим индекс искомого товара
    const idx = items.findIndex(m => {
        return m.motorHomeId.toString() === motorHome._id.toString();
    })
    // Если что то есть в корзине, то увеличиваем на единицу
    if (idx >= 0) {
        // Если такой товар уже есть в корзине
        items[idx].count = items[idx].count + 1;
    } else {
        // Если корзина пуста, добавляем новый элемент
        items.push({
            motorHomeId: motorHome._id,
            count: 1
        })
    };

    this.cart = {items};
    return this.save();
};

// Удаление из корзины
userSchema.methods.removeFromCart = function(id) {
    // Клонируем массив items, чтобы не было потенциальных мутаций
    let items = [...this.cart.items];
    // Находим индекс нужного товара 
    const idx = items.findIndex(m => {
        // Сравниваем индексы товараов
        return m.motorHomeId.toString() === id.toString();
    });
    // Если в корзине есть только один товар
    if (items[idx].count === 1) {
        // Переопределяем массив items
        items = items.filter(m => m.motorHomeId.toString() !== id.toString())
    } else {
        // Если два товара и более, то просто минусуем один товар
        items[idx].count--;
    }
    this.cart = {items};
    return this.save();
};
// Очищаем корзину
userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
}

module.exports = model('User', userSchema);