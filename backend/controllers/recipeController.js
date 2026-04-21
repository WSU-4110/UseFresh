const Recipe = require('../models/Recipe');

const saveRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, type, user } = req.body;
    if (!user) return res.status(400).json({ error: 'userId required' });
    if (!title) return res.status(400).json({ error: 'title required' });

    const newRecipe = await Recipe.create({ title, ingredients: ingredients || [], steps: steps || [], type, user });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const list = await Recipe.find({ user: userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveRecipe, getSavedRecipes, deleteRecipe };
