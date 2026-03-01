import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createLLMProvider } from "./providers.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const llm = createLLMProvider(); //strategy design pattern implemented

app.post("/suggest-recipes", async (req, res) => {
  console.log("HIT /suggest-recipes");
  try {
    const prompt = `
Create ONE simple recipe.
Return ONLY valid JSON in this format:
{
  "title": string,
  "ingredients": string[],
  "steps": string[]
}
`.trim();

    const text = await llm.chat([{ role: "user", content: prompt }]);

    if (!text) {
      return res.status(500).json({ error: "No content returned from model" });
    }

    try {
      const recipe = JSON.parse(text);
      return res.json(recipe);
    } catch {
      return res.json({ raw: text });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "LLM failed", details: String(err) });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));