// Ссессия. Данные, которые отдаются обратно в шаблон
module.exports = function(req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;

    next();
}