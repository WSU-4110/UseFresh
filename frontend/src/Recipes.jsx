import { useState } from "react";
import "./Recipes.css";

export default function Recipes() {
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
      <h1>Recipes</h1>

      <button
        type="button"
        className="generate-recipe-btn"
        onClick={handleGenerateRecipe}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div style={{ marginTop: "20px" }}>
          <h2>{recipe.title}</h2>

          <ul>
            {recipe.ingredients?.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

