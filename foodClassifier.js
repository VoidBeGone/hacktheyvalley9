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
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Given an image of a food item(s), identify the type and quantity of each distinct food present. Your response should be formatted as follows: <food name> <quantity>, separated by commas. For example, if there are 3 apples and 2 bananas, return apples 3, bananas 2. If the quantity cannot be determined for a particular food, set its quantity as 1 (e.g., bread 1, strawberries 1). If no recognizable food items are present, respond with \"invalid input, try again\". Ensure the output only includes food names and quantities, and avoid adding additional information or comments. Also, make sure that all items are as simple as possible, so a granny smith apple is just an apple. \nYour return should be of the JSON format { \"Foods\": [{\"name\":  \"food1\", \"quantity\": food1ammount}, {\"name\":\"food2\", \"quantity\":food2quantity}]}\n\nan example would be\n{ \"Foods\": [{\"name\":  \"carrot\", \"quantity\": 2}, {\"name\":\"banana\", \"quantity\":1}]}\n\nOnce again if an item isn't food, your output should be the words \"invalid input, try again\".\nAnimals that are alive should not be considered food items. \n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Image October 04, 2024 - 10:20PM.jpeg", "image/jpeg"),
    await uploadToGemini("Image October 04, 2024 - 10:21PM.jpeg", "image/jpeg"),
    await uploadToGemini("Image October 04, 2024 - 10:21PM.jpeg", "image/jpeg"),
    await uploadToGemini("Image October 05, 2024 - 5:19PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:21PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:22PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:23PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:23PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:23PM.png", "image/png"),
    await uploadToGemini("Image October 05, 2024 - 5:24PM.png", "image/png"),
  ];

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "carrot"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[1].mimeType,
              fileUri: files[1].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "carrot, tomato\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[2].mimeType,
              fileUri: files[2].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{ \"Foods\": [{\"name\":  \"banana\", \"quantity\": 1}, {\"name\":\"apple\", \"quantity\":1}, {\"name\":\"tomato\", \"quantity\":1}, {\"name\":\"orange\", \"quantity\":1}, {\"name\":\"broccoli\", \"quantity\":1}, {\"name\":\"cucumber\", \"quantity\":1}, {\"name\":\"onion\", \"quantity\":1}, {\"name\":\"green pepper\", \"quantity\":1}, {\"name\":\"red pepper\", \"quantity\":1}]}"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[3].mimeType,
              fileUri: files[3].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "invalid input, try again \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[4].mimeType,
              fileUri: files[4].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{ \"Foods\": [{\"name\":  \"potato\", \"quantity\": 2}, {\"name\":\"green onion\", \"quantity\": 1}, {\"name\":\"butter\", \"quantity\": 1}]}"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[5].mimeType,
              fileUri: files[5].uri,
            },
          },
          {text: "\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{ \"Foods\": [{\"name\":  \"chicken\", \"quantity\": 1}, {\"name\":\"carrot\", \"quantity\": 4}, {\"name\":\"celery\", \"quantity\": 5}, {\"name\":\"onion\", \"quantity\": 1}]}"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[6].mimeType,
              fileUri: files[6].uri,
            },
          },
          {text: "\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "invalid input, try again \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[7].mimeType,
              fileUri: files[7].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "invalid input, try again \n\n\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[8].mimeType,
              fileUri: files[8].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "invalid input, try again \n\n\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[9].mimeType,
              fileUri: files[9].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{ \"Foods\": [{\"name\":  \"pig\", \"quantity\": 1}]}\n\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();
