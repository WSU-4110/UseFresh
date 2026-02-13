// importing syle
import "./Recipes.css";

export default function Recipes() {
    //returns what will be shown on recepies page
  return (
    <main className="recipes-page">
      <h1>Recipes</h1>
      <p>Recipe list will appear here.</p>
      <button type="button" className="generate-recipe-btn">Generate Recipe</button>
    </main>
  );
}
