const express = require('express');
const router = express.Router();
const { saveRecipe, getSavedRecipes, deleteRecipe } = require('../controllers/recipeController');

router.post('/save', saveRecipe);
router.get('/saved', getSavedRecipes);
router.delete('/:id', deleteRecipe);

module.exports = router;
