import HuggingFaceProvider from "./HuggingFaceProvider.js";
import MockProvider from "./MockProvider.js";

export function createLLMProvider() {
  const provider = (process.env.LLM_PROVIDER || "huggingface").toLowerCase();

  if (provider === "mock") return new MockProvider();

  return new HuggingFaceProvider(
    process.env.HF_TOKEN,
    process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct:together"
  );
}