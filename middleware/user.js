const User = require('../models/user');

module.exports = async function(req, res, next) {
    // Если такого пользователя нет
    if (!req.session.user) {
        return next();
    } else {
        //Если пользователь есть
        req.user = await User.findById(req.session.user._id);
        next();
    }
}