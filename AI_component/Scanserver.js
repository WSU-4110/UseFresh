import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { HfInference } from "@huggingface/inference";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });
const hf = new HfInference(process.env.HF_TOKEN);

//connecting to the database code
mongoose.connect(process.env.MONGO_URI, {dbName: "usefresh"} )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const foodSchema = new mongoose.Schema({
  foodItem: String,
  quantity: Number,
  expirationDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Food = mongoose.model("Food", foodSchema,"fooditems");

app.post("/suggest-recipes", async (req, res) => {
  try {
    console.log("1. /suggest-recipes route hit");

    const foods = await Food.find();
    console.log("2. Foods fetched from DB:", foods);

    const ingredients = foods.map(f => f.foodItem).join(", ");
    console.log("3. Ingredients string:", ingredients);

    const prompt = `
You are a recipe generator.

Create exactly ONE simple recipe using these pantry ingredients when possible:
${ingredients}

Rules:
- Write everything in English.
- Return ONLY valid JSON.
- Do not include markdown or code fences.
- Do not include any text before or after the JSON.
- Use this exact format:

{
  "title": string,
  "ingredients": string[],
  "steps": string[]
}
`.trim();

    console.log("4. About to call Hugging Face");

    const chat = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct:together",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.8
    });

    console.log("5. Hugging Face responded");

    const text = chat.choices?.[0]?.message?.content?.trim();
    console.log("6. Raw model output:", text);

    if (!text) {
      return res.status(500).json({ error: "No content returned from model" });
    }

    try {
      const cleaned = text
        .replace(/```json\s*/i, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      console.log("7. Parsed JSON successfully");
      return res.json(parsed);
    } catch (err) {
      console.error("8. JSON parse failed:", err);
      return res.json({ raw: text });
    }
  } catch (err) {
    console.error("9. Route failed:", err);
    return res.status(500).json({ error: "LLM failed", details: String(err) });
  }
});

function normalizeExpirationDate(dateStr) {
  if (!dateStr) return null;

  const cleaned = dateStr.trim();

  // already correct format
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // YYYY/MM -> YYYY-MM-01
  if (/^\d{4}\/\d{2}$/.test(cleaned)) {
    const [year, month] = cleaned.split("/");
    return `${year}-${month}-01`;
  }

  // YYYY-MM -> YYYY-MM-01
  if (/^\d{4}-\d{2}$/.test(cleaned)) {
    return `${cleaned}-01`;
  }

  return null;
}
// Accept one image frame from frontend
app.post("/scan-product", upload.single("frame"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No frame uploaded" });
    }

    const mode = req.body.mode;
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    console.log("mode:", mode);
    console.log("mimeType:", mimeType);
    console.log("file size:", req.file.size);

    let prompt = "";

    if (mode === "product") {
      prompt = `
You are reading a grocery product label.

Identify the main product name shown in the image.

Return ONLY valid JSON:
{
  "product_name": string | null,
  "confidence": number,
  "reason": string
}
`.trim();
    } else if (mode === "expiration") {
      prompt = `
You are reading a grocery expiration label.

Identify any expiration, best-by, use-by, or sell-by date.

Return ONLY valid JSON:
{
  "expiration_date": string | null,
  "confidence": number,
  "reason": string
}
`.trim();
    } else {
      return res.status(400).json({ success: false, error: "Invalid mode" });
    }

    const chat = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-VL-7B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 200,
      temperature: 0.2
    });

    const text = chat.choices?.[0]?.message?.content?.trim();

    console.log("=== RAW MODEL OUTPUT ===");
    console.log(text);
    console.log("========================");

    if (!text) {
      return res.status(500).json({
        success: false,
        error: "No content returned from vision model"
      });
    }

    let parsed;
    try {
      const cleaned = text
        .replace(/```json\s*/i, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch {
      return res.json({
        success: false,
        error: "Model response was not valid JSON",
        raw: text
      });
    }

    if (mode === "product") {
      return res.json({
        success: true,
        detected: Boolean(parsed.product_name),
        product_name: parsed.product_name ?? null,
        confidence: parsed.confidence ?? 0,
        reason: parsed.reason ?? ""
      });
    }

    const normalizedDate = normalizeExpirationDate(parsed.expiration_date);

    return res.json({
      success: true,
      detected: Boolean(normalizedDate),
      expiration_date: normalizedDate,
      confidence: parsed.confidence ?? 0,
      reason: parsed.reason ?? ""
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Scan failed",
      details: String(err)
    });
  }
});

// below code is for mock data!
// app.post("/scan-product", upload.single("frame"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, error: "No frame uploaded" });
//     }

//     const mode = req.body.mode;

//     if (mode === "product") {
//       return res.json({
//         success: true,
//         detected: true,
//         product_name: "Chobani Greek Yogurt",
//         confidence: 0.95,
//         reason: "Mock product detection"
//       });
//     }

//     if (mode === "expiration") {
//       return res.json({
//         success: true,
//         detected: true,
//         expiration_date: "2026-03-18",
//         confidence: 0.93,
//         reason: "Mock expiration detection"
//       });
//     }

//     return res.status(400).json({ success: false, error: "Invalid mode" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: "Scan failed",
//       details: String(err)
//     });
//   }
// });

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});