const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Получаем токен из заголовка Authorization (ожидается формат "Bearer <token>")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // Если токена нет, в зависимости от Accept возвращаем редирект или JSON-ошибку
    if (!token) {
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/login.html');
        } else {
            return res.status(401).json({ error: 'No token provided, access denied' });
        }
    }

    // Пытаемся верифицировать токен
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { userId, email, username, iat, exp }

        req.user = decoded;
        // Теперь в req.user.userId хранится идентификатор пользователя

        next();
    } catch (error) {
        // Если токен недействителен, делаем редирект или возвращаем JSON-ошибку
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/login.html');
        } else {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }
};
