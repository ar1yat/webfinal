const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
// timestamps: true автоматически добавляет поля createdAt и updatedAt

module.exports = mongoose.model('Recipe', RecipeSchema);
