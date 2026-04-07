import { RecipeService } from "./RecipeService.js";
import { jest } from "@jest/globals";
//testing
describe("RecipeService", () => {
  let service;

  beforeEach(() => {
    service = new RecipeService({});
  });

  test("buildRecipePrompt MUST include title, ingredients, and steps", () => {
    const prompt = service.buildRecipePrompt();

    expect(prompt).toContain("Create ONE simple recipe");
    expect(prompt).toContain('"title"');
    expect(prompt).toContain('"ingredients"');
    expect(prompt).toContain('"steps"');
  });

  test("parseRecipeResponse is able to parse valid JSON", () => {
    const text = JSON.stringify({
      title: "Toast",
      ingredients: ["bread", "butter"],
      steps: ["Toast bread", "Spread butter"]
    });

    const result = service.parseRecipeResponse(text);

    expect(result.title).toBe("Toast");
    expect(result.ingredients).toEqual(["bread", "butter"]);
    expect(result.steps).toEqual(["Toast bread", "Spread butter"]);
  });

  test("parseRecipeResponse throws an error when given empty input", () => {
    expect(() => service.parseRecipeResponse("")).toThrow(
      "No content returned from model"
    );
  });

  test("parseRecipeResponse throws an error when given invalid JSON", () => {
    expect(() => service.parseRecipeResponse(100)).toThrow(
      "Failed to parse model response as JSON"
    );
  });

    test("suggestRecipe returns parsed recipe from hf response", async () => {
    const mockHf = {
      chatCompletion: jest.fn().mockResolvedValue({
        choices: [{message: {
              content: JSON.stringify({
                title: "Pasta",
                ingredients: ["pasta", "sauce"],
                steps: ["Boil water", "Cook pasta"]})}
          }]
      })
    };

    const recipeService = new RecipeService(mockHf);
    const result = await recipeService.requestRecipe();

    expect(mockHf.chatCompletion).toHaveBeenCalled();
    expect(result.title).toBe("Pasta");
    expect(result.ingredients).toEqual(["pasta", "sauce"]);
    expect(result.steps).toEqual(["Boil water", "Cook pasta"]);
  });
});