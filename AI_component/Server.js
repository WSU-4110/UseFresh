import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { HfInference } from "@huggingface/inference";
import { RecipeService } from "./RecipeService.js";
import { ScanService } from "./ScanService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });
const hf = new HfInference(process.env.HF_TOKEN);

const recipeService = new RecipeService(hf);
const scanService = new ScanService(hf);

app.post("/suggest-recipes", async (req, res) => {
  try {
    const result = await recipeService.requestRecipe();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "LLM failed", details: String(err) });
  }
});

app.post("/scan-product", upload.single("frame"), async (req, res) => {
  try {
    const result = await scanService.scan(req.file, req.body.mode);
    return res.json(result);
  } catch (err) {
    const msg = String(err.message || err);

    if (msg === "No frame uploaded" || msg === "Invalid mode") {
      return res.status(400).json({ success: false, error: msg });
    }

    if (msg.includes("No content returned")) {
      return res.status(500).json({ success: false, error: msg });
    }

    return res.status(500).json({
      success: false,
      error: "Scan failed",
      details: String(err)
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});