import { HfInference } from "@huggingface/inference";
import LLMProvider from "./LLMProvider.js";

export default class HuggingFaceProvider extends LLMProvider {
  constructor(token, model) {
    super();
    if (!token) throw new Error("HF_TOKEN missing");
    this.hf = new HfInference(token);
    this.model = model;
  }

  async chat(messages) {
    const chat = await this.hf.chatCompletion({
      model: this.model,
      messages,
      max_tokens: 300,
      temperature: 1.0,
    });

    return chat.choices?.[0]?.message?.content?.trim() || "";
  }
}