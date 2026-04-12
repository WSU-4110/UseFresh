import { useState, useEffect } from "react";
import "./Recipes.css";
import useFreshLogo from "./Logo/UseFreshLogo.png";

export default function Recipes() {

  useEffect(() => {
  document.title = "Recipes - UseFresh";
  }, []);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerateRecipe() {
  console.log("BUTTON CLICKED"); // proves click works
  setLoading(true);

  try {
    console.log("ABOUT TO FETCH...");
    const res = await fetch("http://localhost:5000/suggest-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})  // important
    });

    console.log("FETCH DONE, status:", res.status);
    const data = await res.json();
    console.log("DATA:", data);

    setRecipe(data);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }

  setLoading(false);
}

  return (
    <main className="recipes-page">
      <img src={useFreshLogo} alt="UseFresh logo" className="recipes-logo" />
      <h1>Recipes</h1>

      <button
        type="button"
        className="generate-recipe-btn"
        onClick={handleGenerateRecipe}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

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

        </div>
      )}
    </main>
  );
}

