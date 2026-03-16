import FoodRepository from "../repositories/FoodRepository.js";
//Hugging face and post logic moved to this file
class RecipeService {

  constructor(hf) {
    this.hf = hf;
  }

  async generateRecipe() {

    const foods = await FoodRepository.getAllFoods();

    const ingredients = foods.map(f => f.foodItem).join(", ");

    const prompt = `
Create exactly ONE simple recipe using these ingredients:
${ingredients}

Return ONLY valid JSON:
{
 "title": string,
 "ingredients": string[],
 "steps": string[]
}
`;

    const chat = await this.hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct:together",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.8
    });

    return chat.choices?.[0]?.message?.content?.trim();
  }
}

export default RecipeService;