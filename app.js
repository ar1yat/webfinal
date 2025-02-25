require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Импортируем маршруты
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

const app = express();

// Подключаемся к базе
connectDB();

// Позволяем Express парсить JSON и данные форм (urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздаём статические файлы из папки "public"
app.use(express.static(path.join(__dirname, 'public')));

// Явный маршрут для корня сайта (необязателен, но можно оставить для наглядности)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Регистрируем маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

// Запускаем сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the site`);
});
