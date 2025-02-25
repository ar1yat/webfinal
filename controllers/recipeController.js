const Recipe = require('../models/Recipe');

// Создание рецепта
exports.createRecipe = async (req, res, next) => {
    try {
        const { title, description, ingredients, instructions } = req.body;
        const recipe = new Recipe({
            title,
            description,
            // Превращаем строку ingredients в массив, если нужно:
            ingredients: ingredients.split(',').map(i => i.trim()),
            instructions,
            author: req.user.userId // Важно: userId (не id)
        });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        next(error);
    }
};

// Получение всех рецептов текущего пользователя
exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ author: req.user.userId });
        res.json(recipes);
    } catch (error) {
        next(error);
    }
};

// Получение конкретного рецепта по ID
exports.getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, author: req.user.userId });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        next(error);
    }
};

// Обновление рецепта
exports.updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findOneAndUpdate(
            { _id: req.params.id, author: req.user.userId },
            req.body,
            { new: true }
        );
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        next(error);
    }
};

// Удаление рецепта
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user.userId });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        next(error);
    }
};

// Получить все рецепты всех пользователей
exports.getAllRecipes = async (req, res, next) => {
    try {
        // Используем .populate('author', 'username') чтобы подставить username автора
        const recipes = await Recipe.find({}).populate('author', 'username');
        res.json(recipes);
    } catch (error) {
        next(error);
    }
};
