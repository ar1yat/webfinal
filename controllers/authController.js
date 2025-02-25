const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём пользователя
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // После успешной регистрации – редирект на страницу логина + сообщение
        return res.redirect('/login.html?message=User+registered+successfully');
    } catch (error) {
        next(error);
    }
};


// /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Wrong email address or password' });
        }

        // Сравниваем пароли
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong email address or password' });
        }

        // Генерируем JWT
        // В payload кладём userId (именно userId, чтобы совпадало с тем, что мы используем в контроллере рецептов)
        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    // При использовании JWT logout выполняется на клиенте (удалением токена)
    return res.json({ message: 'Logged out successfully' });
};
