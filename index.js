const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session); // Синхронизирует базу данных MongoDB с express-session
const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // for warrning [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery`
const app = express();
const path = require('path');
const flash = require('connect-flash'); // Flash-сообщения - это сообщения об ошибке, которые сохраняются в сессии
const Handlebars = require('handlebars'); //======
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'); // ==========
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const motorHomesRoutes = require('./routes/motorhomes');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');
const errorHandler = require('./middleware/error');
const keys = require('./keys');

const PORT = process.env.PORT || 3000;

// Конфигурация handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

// Синхронизирует базу данных MongoDB с express-session
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI

});

// Конфигурация шаблонизатора
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// Сздаем нового юзера для примера
// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('63d43999b37e066e13d47cf0');
//         req.user = user;
//         next();
//     } catch (err) {
//         console.log(err);
//     }
// });

//! Middleware
// Настраиваем пути/маршруты
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));

// Подключение сессии
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Подключаем БД
    store
}));
// Avatar
app.use(fileMiddleware.single('avatar'));
// Cообщения об ошибке, которые сохраняются в сессии
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// Регистрация роутов (маршрутов)
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/motorhomes', motorHomesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
// 404 ошибка
app.use(errorHandler);

// Прослушивание сервера
async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true});
        // Пример - до БД - Создание нового пользователя - проверяем, если пользователь есть - то ничего не делаем. Если же нет - создаем нового пользователя
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'alex@mail.com',
        //         name: 'Alex',
        //         card: {items: []}
        //     });
            // Сохраняем нового пользователя
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
};
start();