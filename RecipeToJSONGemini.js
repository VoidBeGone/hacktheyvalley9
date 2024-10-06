/*You will be given an input of the form 

Title: 
Ingredients: 
Instuructions: 


What I want you to do is return this in the form of a JSON object named recipe as follows:

title: recipe name as a string
ingredients: list of food objects, each with:
 a String called name which is the name of the food item
a String called quantity (which can be in volume, count, weight, etc.)
a String called prep which is describes the preparation required for the ingredient before using it in the recipe, or empty if no prepartion is require for the ingredient.
instructions: a string which contains the recipe's instructions

As an example if we have the recipe: 
Title: Tuna, Blue Cheese, and Garlic Stuffed Peppers

Ingredients:
['1 (6-ounce) can tuna, drained', '1/4 cup crumbled blue cheese', '1 clove garlic, minced', '1/2 cup chopped onion', '1 tablespoon olive oil', '1 tablespoon red wine vinegar', '1/4 teaspoon salt', '1/4 teaspoon black pepper', '4 bell peppers, halved lengthwise and seeds removed']

Instructions:
Preheat the oven to 375 degrees F (190 degrees C).
In a medium bowl, combine the tuna, blue cheese, garlic, onion, olive oil, vinegar, salt, and pepper. Mix well.
Divide the tuna mixture evenly among the pepper halves.
Place the stuffed pepper halves in a baking dish.
Bake in the preheated oven until the peppers are tender, about 30 minutes.
Serve immediately. 

You should return: 
{
  "recipe": {
    "title": "Tuna, Blue Cheese, and Garlic Stuffed Peppers",
    "ingredients": [
      {
        "name": "Tuna",
        "quantity": "1 (6-ounce) can",
        "prep": "drained"
      },
      {
        "name": "Blue Cheese",
        "quantity": "1/4 cup",
        "prep": "crumbled"
      },
      {
        "name": "Garlic",
        "quantity": "1 clove",
        "prep": "minced"
      },
      {
        "name": "Onion",
        "quantity": "1/2 cup",
        "prep": "chopped"
      },
      {
        "name": "Olive Oil",
        "quantity": "1 tablespoon",
        "prep": ""
      },
      {
        "name": "Red Wine Vinegar",
        "quantity": "1 tablespoon",
        "prep": ""
      },
      {
        "name": "Salt",
        "quantity": "1/4 teaspoon",
        "prep": ""
      },
      {
        "name": "Black Pepper",
        "quantity": "1/4 teaspoon",
        "prep": ""
      },
      {
        "name": "Bell Peppers",
        "quantity": "4, halved lengthwise",
        "prep": "seeds removed"
      }
    ],
    "instructions": "Preheat the oven to 375 degrees F (190 degrees C). In a medium bowl, combine the tuna, blue cheese, garlic, onion, olive oil, vinegar, salt, and pepper. Mix well. Divide the tuna mixture evenly among the pepper halves. Place the stuffed pepper halves in a baking dish. Bake in the preheated oven until the peppers are tender, about 30 minutes. Serve immediately."
  }
}
*/


/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You will be given an input of the form \n\nTitle: \nIngredients: \nInstuructions: \n\n\nWhat I want you to do is return this in the form of a JSON object named recipe as follows:\n\ntitle: recipe name as a string\ningredients: list of food objects, each with:\n a String called name which is the name of the food item\na String called quantity (which can be in volume, count, weight, etc.)\na String called prep which is describes the preparation required for the ingredient before using it in the recipe, or empty if no prepartion is require for the ingredient.\ninstructions: a string which contains the recipe's instructions\n\nAs an example if we have the recipe: \nTitle: Tuna, Blue Cheese, and Garlic Stuffed Peppers\n\nIngredients:\n['1 (6-ounce) can tuna, drained', '1/4 cup crumbled blue cheese', '1 clove garlic, minced', '1/2 cup chopped onion', '1 tablespoon olive oil', '1 tablespoon red wine vinegar', '1/4 teaspoon salt', '1/4 teaspoon black pepper', '4 bell peppers, halved lengthwise and seeds removed']\n\nInstructions:\nPreheat the oven to 375 degrees F (190 degrees C).\nIn a medium bowl, combine the tuna, blue cheese, garlic, onion, olive oil, vinegar, salt, and pepper. Mix well.\nDivide the tuna mixture evenly among the pepper halves.\nPlace the stuffed pepper halves in a baking dish.\nBake in the preheated oven until the peppers are tender, about 30 minutes.\nServe immediately. \n\nYou should return: \n{\n  \"recipe\": {\n    \"title\": \"Tuna, Blue Cheese, and Garlic Stuffed Peppers\",\n    \"ingredients\": [\n      {\n        \"name\": \"Tuna\",\n        \"quantity\": \"1 (6-ounce) can\",\n        \"prep\": \"drained\"\n      },\n      {\n        \"name\": \"Blue Cheese\",\n        \"quantity\": \"1/4 cup\",\n        \"prep\": \"crumbled\"\n      },\n      {\n        \"name\": \"Garlic\",\n        \"quantity\": \"1 clove\",\n        \"prep\": \"minced\"\n      },\n      {\n        \"name\": \"Onion\",\n        \"quantity\": \"1/2 cup\",\n        \"prep\": \"chopped\"\n      },\n      {\n        \"name\": \"Olive Oil\",\n        \"quantity\": \"1 tablespoon\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Red Wine Vinegar\",\n        \"quantity\": \"1 tablespoon\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Salt\",\n        \"quantity\": \"1/4 teaspoon\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Black Pepper\",\n        \"quantity\": \"1/4 teaspoon\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Bell Peppers\",\n        \"quantity\": \"4, halved lengthwise\",\n        \"prep\": \"seeds removed\"\n      }\n    ],\n    \"instructions\": \"Preheat the oven to 375 degrees F (190 degrees C). In a medium bowl, combine the tuna, blue cheese, garlic, onion, olive oil, vinegar, salt, and pepper. Mix well. Divide the tuna mixture evenly among the pepper halves. Place the stuffed pepper halves in a baking dish. Bake in the preheated oven until the peppers are tender, about 30 minutes. Serve immediately.\"\n  }\n}\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "Title: Tuna, Garlic, and Blue Cheese Melt\nIngredients:\n[‘2 tablespoons olive oil’, ‘1 (5.5 oz) can tuna, drained’, ‘4 garlic cloves, minced’, ‘¼ cup blue cheese’, ‘½ cup mayonnaise’, ‘1 tablespoon grated Parmesan’, ‘1 tablespoon lemon juice’, ‘4 slices bread (rye or sourdough recommended)’, ‘Butter (for spreading)’, ‘Salt and pepper to taste’]\nInstructions:\nPreheat your oven to 350 degrees. In a medium bowl, combine tuna, garlic, blue cheese, mayonnaise, Parmesan, and lemon juice. Season with salt and pepper to taste. Spread mixture evenly over 2 slices of bread. Top with remaining slices.\nSpread butter over the exterior of each sandwich. Place sandwiches in a baking dish. Bake until cheese is melted and bubbly, about 5 minutes. Serve hot. \n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"recipe\": {\n    \"title\": \"Tuna, Garlic, and Blue Cheese Melt\",\n    \"ingredients\": [\n      {\n        \"name\": \"Olive Oil\",\n        \"quantity\": \"2 tablespoons\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Tuna\",\n        \"quantity\": \"1 (5.5 oz) can\",\n        \"prep\": \"drained\"\n      },\n      {\n        \"name\": \"Garlic\",\n        \"quantity\": \"4 cloves\",\n        \"prep\": \"minced\"\n      },\n      {\n        \"name\": \"Blue Cheese\",\n        \"quantity\": \"¼ cup\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Mayonnaise\",\n        \"quantity\": \"½ cup\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Parmesan\",\n        \"quantity\": \"1 tablespoon\",\n        \"prep\": \"grated\"\n      },\n      {\n        \"name\": \"Lemon Juice\",\n        \"quantity\": \"1 tablespoon\",\n        \"prep\": \"\"\n      },\n      {\n        \"name\": \"Bread\",\n        \"quantity\": \"4 slices\",\n        \"prep\": \"(rye or sourdough recommended)\"\n      },\n      {\n        \"name\": \"Butter\",\n        \"quantity\": \"\",\n        \"prep\": \"for spreading\"\n      },\n      {\n        \"name\": \"Salt\",\n        \"quantity\": \"\",\n        \"prep\": \"to taste\"\n      },\n      {\n        \"name\": \"Pepper\",\n        \"quantity\": \"\",\n        \"prep\": \"to taste\"\n      }\n    ],\n    \"instructions\": \"Preheat your oven to 350 degrees. In a medium bowl, combine tuna, garlic, blue cheese, mayonnaise, Parmesan, and lemon juice. Season with salt and pepper to taste. Spread mixture evenly over 2 slices of bread. Top with remaining slices. Spread butter over the exterior of each sandwich. Place sandwiches in a baking dish. Bake until cheese is melted and bubbly, about 5 minutes. Serve hot.\"\n  }\n}\n```"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();
