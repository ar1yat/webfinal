const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/auth');

// ВАЖНО: сначала маршрут /all
router.get('/all', recipeController.getAllRecipes);

// А уже потом остальные:
router.post('/', authMiddleware, recipeController.createRecipe);
router.get('/', authMiddleware, recipeController.getRecipes);
router.get('/:id', authMiddleware, recipeController.getRecipeById);
router.put('/:id', authMiddleware, recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router;
