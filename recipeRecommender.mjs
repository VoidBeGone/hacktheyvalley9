/*You are a recipe recommender being used in a recipe app. Your purpose it to output recipes based on the list of ingredients the user has input. While you will not be penalized for using all the ingredients in the input you don't have to. Also you will take three fields in the input. 1.) Ingredients: this is the ingredients to be used 2.) Difficulty(Easy, Medium, Hard) if this field is None set recipe to easy. 3.) Recipe Style: This can be dessert, main, drink, etc. if specified to none, this field should be main. There will also be a field with must use ingredients, these are ingredients that have to be included in the recipe, 

for example if give a list of ingredients: Saffron, Tahini, Star Anise, Quinoa, Sumac, Pomegranate, Molasses, Gochujang (Korean Chili Paste), Oyster Mushrooms, Yuzu Juice, Freekeh, cookies, salmon.  If in the must use ingredients we have salmon, then the recipe must include salmon. If this field is None then pretend it doesn't exist. 

The input will be of the form 
Ingredients: food1, food2, food3, ... (each food separated by a comma)
Recipe Style: style
Main Ingredients: food1, food2, ...
Difficulty: difficulty

Your response should be of the form
Title:
Ingredients:
Instructions:
Don't add anything else to the output

If you cannot generate a recipe containing any of the ingredients, your response should be " Cannot Generate Recipe, Give New Ingredients"*/

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
  
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
  You are a recipe recommender being used in a recipe app. Your purpose is to output **exactly one recipe** based on the list of ingredients the user has input. **Do not generate more than one recipe.** You must stop after generating one recipe, and do not provide alternatives, suggestions, or more than one recipe in any form.

Ingredients: This is the list of ingredients to be used.
Recipe Style: This can be dessert, main, drink, etc. If this field is None, set the recipe style to Main.

For example, if given the following list of ingredients: Saffron, Tahini, Star Anise, Quinoa, Sumac, Pomegranate, Molasses, Gochujang (Korean Chili Paste), Oyster Mushrooms, Yuzu Juice, Freekeh, cookies, salmon, you should aim to use as many of these ingredients as possible, but you **must only generate one recipe**.

The input will be in the following form:
- Ingredients: food1, food2, food3, ... (each food separated by a comma)
- Recipe Style: style
- Main Ingredients: food1, food2, ...

You must generate **exactly one recipe** based on the given ingredients. The response must follow this structure:

Title:
Ingredients:
Instructions:

Make sure to **generate exactly one recipe** and avoid producing multiple recipes in any form.`,
});


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};// Function to extract only the first recipe from the response

function extractFirstRecipe(recipeText) {
  // Find the position of the first "Title" and second "Title"
  const firstTitleIndex = recipeText.indexOf("Title:");
  const secondTitleIndex = recipeText.indexOf("Title:", firstTitleIndex + 1);

  // If there's a second "Title", extract only the part from the first Title to just before the second Title
  if (secondTitleIndex !== -1) {
    return recipeText.substring(0, secondTitleIndex).trim();
  }

  // If there's no second Title, return the entire text
  return recipeText.trim();
}


export async function runrecipe(inputvalue) {
  const ingredientsList = inputvalue.map(item => item.name).join(", ");

  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(`Ingredients: ${ingredientsList}. You must generate exactly one recipe.`);

  const fullRecipeText = result.response.text();
  const singleRecipe = extractFirstRecipe(fullRecipeText);
  //console.log(singleRecipe);
  return singleRecipe;


}


