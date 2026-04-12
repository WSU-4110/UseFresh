import { useEffect, useState } from 'react';
import './Recipes.css';

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/recipes/saved?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error('Load saved recipes error:', err);
      setRecipes([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();

    document.title = "Saved Recipes - UseFresh";

  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this saved recipe?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRecipes((r) => r.filter((x) => x._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete');
    }
  };

  return (
    <main className="recipes-page">
      <h1>Saved Recipes</h1>

      {loading && <p>Loading...</p>}

      {!loading && recipes.length === 0 && <p>No saved recipes yet.</p>}

      <div style={{ maxWidth: 760, margin: '18px auto' }}>
        {recipes.map((r) => (
          <div key={r._id} className="recipe-container" style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0 }}>{r.title}</h2>
            <p style={{ margin: '6px 0', color: '#555' }}>{r.type || ''}</p>

            <div className="recipe-section">
              <h4>Ingredients</h4>
              <ul>
                {r.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-section">
              <h4>Steps</h4>
              <ol>
                {r.steps?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="generate-recipe-btn" onClick={() => handleDelete(r._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
