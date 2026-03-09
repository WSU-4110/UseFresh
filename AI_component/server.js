// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { HfInference } from "@huggingface/inference";
// import mongoose from "mongoose";

// dotenv.config();
// console.log("HF_TOKEN exists?", !!process.env.HF_TOKEN);

// //connecting to the database code
// mongoose.connect(process.env.MONGO_URI, {dbName: "usefresh"} )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error(err));

// const foodSchema = new mongoose.Schema({
//   foodItem: String,
//   quantity: Number,
//   expirationDate: Date
// });

// const Food = mongoose.model("Food", foodSchema,"fooditems");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const hf = new HfInference(process.env.HF_TOKEN);

// app.post("/suggest-recipes", async (req, res) => {
//   console.log("HIT /suggest-recipes");
//   try {
//     const foods = await Food.find();
//     console.log("Foods from DB:", foods);
//     const ingredients = foods.map(f => f.foodItem).join(", ");

//   const prompt = `
//   Create ONE simple recipe using these ingredients if possible: ${ingredients}.

//   Return ONLY valid JSON in this format:
//   {
//     "title": string,
//     "ingredients": string[],
//     "steps": string[]
//   }
//   `.trim();

//     const chat = await hf.chatCompletion({
//       model: "Qwen/Qwen2.5-7B-Instruct:together",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 300,
//       temperature: 1.0
//     });

//     const text = chat.choices?.[0]?.message?.content?.trim();

//     if (!text) {
//       return res.status(500).json({ error: "No content returned from model" });
//     }

//     // Try to parse JSON. If it fails, return just the raw text for now, will change for sprint2.
//     try {
//       const recipe = JSON.parse(text);
//       return res.json(recipe);
//     } catch {
//       return res.json({ raw: text });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "LLM failed", details: String(err) });
//   }
// });

// app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
