export class RecipeService {
  constructor(hf) {
    this.hf = hf;
  }

  buildRecipePrompt() {
    return `
Create ONE simple recipe.
Return ONLY valid JSON in this format:
{
  "title": string,
  "ingredients": string[],
  "steps": string[]
}
`.trim();
  }

  parseRecipeResponse(text) {
    if (!text) {
      throw new Error("No content returned from model");
    }
    else if (typeof text !== "string") {
      throw new Error("Failed to parse model response as JSON");
    }

    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  async requestRecipe() {
    const prompt = this.buildRecipePrompt();

    const chat = await this.hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct:together",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 1.0
    });

    const text = chat.choices?.[0]?.message?.content?.trim();
    return this.parseRecipeResponse(text);
  }
}