// userController.js

const User = require('../models/User');

// Получение профиля
exports.getProfile = async (req, res, next) => {
    try {
        // Предположим, что в req.user.userId хранится ID текущего пользователя
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Возвращаем данные пользователя
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Обновление профиля
exports.updateProfile = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
