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
    systemInstruction: `You are a recipe recommender being used in a recipe app. Your purpose is to output **only one recipe** based on the list of ingredients the user has input. You do not have to use all the ingredients in the input, but you should aim to use as many ingredients as possible.

Ingredients: This is the list of ingredients to be used.
Recipe Style: This can be dessert, main, drink, etc. If this field is None, set the recipe style to Main.

For example, if given the following list of ingredients: Saffron, Tahini, Star Anise, Quinoa, Sumac, Pomegranate, Molasses, Gochujang (Korean Chili Paste), Oyster Mushrooms, Yuzu Juice, Freekeh, cookies, salmon, you should aim to use as many of these ingredients as possible, but you do not have to use all of them.

The input will be in the following form:
- Ingredients: food1, food2, food3, ... (each food separated by a comma)
- Recipe Style: style
- Main Ingredients: food1, food2, ...

You must generate **exactly one recipe** based on the given ingredients. The response should follow this structure:

Title:
Ingredients:
Instructions:

Try your hardest to come up with a recipe and only resort to the error response if you have exhausted all other methods of recipe generation. Ensure that the recipe uses at least one of the ingredients from the list.
`,
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  

  export async function runrecipe(inputvalue){
    const ingredientsList = inputvalue.map(item => item.name).join(", ");
    const chatSession = model.startChat({
      generationConfig,
    });
  
    const result = await chatSession.sendMessage(ingredientsList);
    console.log(result.response.text());
  }
