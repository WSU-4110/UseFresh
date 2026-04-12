import { useState, useEffect } from "react";
import "./Recipes.css";
import useFreshLogo from "./Logo/UseFreshLogo.png";

export default function Recipes() {

  useEffect(() => {
  document.title = "Recipes - UseFresh";
  }, []);

  const [recipe, setRecipe] = useState(null);
  // loadingType holds the meal type currently generating, or null
  const [loadingType, setLoadingType] = useState(null);

  async function handleGenerateRecipe(type) {
    console.log("GENERATE CLICKED", type);
    setLoadingType(type);

    // Define the prompt for each meal type
    const prompts = {
      breakfast:
        `Generate a breakfast recipe using the provided grocery items and prioritize ingredients that expire soon.
          Only generate a breakfast-style dish such as eggs, toast, oats, smoothies, pancakes, breakfast bowls, or light savory dishes.
          Do not suggest lunch or dinner meals.
          Return:
          - title
          - ingredients
          - steps`,
      lunch:
        ` Generate a lunch recipe using the provided grocery items and prioritize ingredients that expire soon.
          Only generate a lunch-style dish such as sandwiches, wraps, salads, rice bowls, soups, or light pasta dishes.
          Do not suggest breakfast or dinner meals.
          Return:
          - title
          - ingredients
          - steps`,
        dinner:
        ` Generate a dinner recipe using the provided grocery items and prioritize ingredients that expire soon.
          Only generate a dinner-style dish such as hearty pasta, stir fry, curry, grain bowls, roasted dishes, or full entrees.
          Do not suggest breakfast or lunch meals.
          Return:
          - title
          - ingredients
          - steps`,
        };

    const prompt = prompts[type] || `Generate one ${type} recipe and return title, ingredients, and steps.`;
    const userId = localStorage.getItem("userId");


    try {
      const res = await fetch("http://localhost:5000/suggest-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt, userId })
      });

      console.log("FETCH DONE, status:", res.status);
      const data = await res.json();
      console.log("DATA:", data);

      setRecipe(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }

    setLoadingType(null);
  }

  // Save current recipe to backend for the logged-in user
  const [saving, setSaving] = useState(false);
  const handleSaveRecipe = async () => {
    if (!recipe) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to save recipes.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: recipe.title || 'Untitled',
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        type: recipe.type || null,
        user: userId
      };

      const res = await fetch('http://localhost:3001/api/recipes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }

      alert('Recipe saved.');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save recipe.');
    }

    setSaving(false);
  };

  return (
    <main className="recipes-page">
      <img src={useFreshLogo} alt="UseFresh logo" className="recipes-logo" />
      <h1>Recipes</h1>

      <div className="recipe-btn-group">
        <button
          type="button"
          className="generate-recipe-btn"
          onClick={() => handleGenerateRecipe('breakfast')}
          disabled={loadingType === 'breakfast'}
        >
          {loadingType === 'breakfast' ? 'Generating...' : 'Generate Breakfast'}
        </button>

        <button
          type="button"
          className="generate-recipe-btn"
          onClick={() => handleGenerateRecipe('lunch')}
          disabled={loadingType === 'lunch'}
        >
          {loadingType === 'lunch' ? 'Generating...' : 'Generate Lunch'}
        </button>

        <button
          type="button"
          className="generate-recipe-btn"
          onClick={() => handleGenerateRecipe('dinner')}
          disabled={loadingType === 'dinner'}
        >
          {loadingType === 'dinner' ? 'Generating...' : 'Generate Dinner'}
        </button>
      </div>

      {recipe && (
        <div className="recipe-container">

          {recipe.title && <h2 className="recipe-title">{recipe.title}</h2>}

          <div className="recipe-section">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients?.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <h3>Steps</h3>
            <ol className="steps-list">
              {recipe.steps?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button
              type="button"
              className="save-recipe-btn"
              onClick={handleSaveRecipe}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>

        </div>
      )}
    </main>
  );
}

