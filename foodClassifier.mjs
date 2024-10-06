import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

const apiKey = "AIzaSyDG2W5yrCe-nWTeHVXaZfoLHal6b7foUvo"
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    Given an image of a food item(s), identify the type and quantity of each distinct food present.
    Your response should be formatted as follows: <food name> <quantity>, separated by commas.
    For example, if there are 3 apples and 2 bananas, return apples 3, bananas 2.
    If the quantity cannot be determined for a particular food, set its quantity as 1 (e.g., bread 1, strawberries 1).
    If no recognizable food items are present, respond with "invalid input, try again".
    Ensure the output only includes food names and quantities, and avoid adding additional information or comments.
    Also, make sure that all items are as simple as possible, so a granny smith apple is just an apple.
    Your return should be of the JSON format: { "Foods": [{"name": "food1", "quantity": food1amount}, {"name": "food2", "quantity": food2quantity}]}
    An example would be: { "Foods": [{"name": "carrot", "quantity": 2}, {"name": "banana", "quantity": 1}]}
    Once again, if an item isn't food, your output should be the words "invalid input, try again".
    Animals that are alive should not be considered food items.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to upload the image to Gemini with MIME type
async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path, // Using the file path as the display name
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

export async function run(inputfile) {
  try {
    // Create the chat session
    const chatSession = model.startChat({
      generationConfig,
    });

    // Fix the MIME type and file path and upload the file
    //"food.png"
    const filePart1 = await uploadToGemini(inputfile, "image/png");
    console.log(filePart1);

    // Send the file part as a message (after it is uploaded)
    const result = await model.generateContent([
      `
    Given an image of a food item(s), identify the type and quantity of each distinct food present.
    Your response should be formatted as follows: <food name> <quantity>, separated by commas.
    For example, if there are 3 apples and 2 bananas, return apples 3, bananas 2.
    If the quantity cannot be determined for a particular food, set its quantity as 1 (e.g., bread 1, strawberries 1).
    If no recognizable food items are present, respond with "invalid input, try again".
    Ensure the output only includes food names and quantities, and avoid adding additional information or comments.
    Also, make sure that all items are as simple as possible, so a granny smith apple is just an apple.
    Your return should be of the JSON format: { "Foods": [{"name": "food1", "quantity": food1amount}, {"name": "food2", "quantity": food2quantity}]}
    An example would be: { "Foods": [{"name": "carrot", "quantity": 2}, {"name": "banana", "quantity": 1}]}
    Once again, if an item isn't food, your output should be the words "invalid input, try again".
    Animals that are alive should not be considered food items.`,
      {
        fileData: {
          fileUri: filePart1.uri,  // Correct reference to the uploaded file's URI
          mimeType: filePart1.mimeType,  // Correct MIME type
        },
      },
    ]);
    
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Error reading file or sending message:', error);
  }
}
// Run the function
