// Middleware - Защита роутов
module.exports = function(req, res, next) {
    // Проверяем авторизацию
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    next();
};