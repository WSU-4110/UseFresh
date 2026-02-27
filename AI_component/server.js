import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();
console.log("HF_TOKEN exists?", !!process.env.HF_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

const hf = new HfInference(process.env.HF_TOKEN);

app.post("/suggest-recipes", async (req, res) => {
  console.log("HIT /suggest-recipes");
  try {
    // For now: static prompt, no getting data from database yet, will change for sprint2
    const prompt = `
Create ONE simple recipe.
Return ONLY valid JSON in this format:
{
  "title": string,
  "ingredients": string[],
  "steps": string[]
}
`.trim();

    const chat = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct:together",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 1.0
    });

    const text = chat.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({ error: "No content returned from model" });
    }

    // Try to parse JSON. If it fails, return just the raw text for now, will change for sprint2.
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
