import { createServer } from "http";
import express from "express";
import crypto from 'crypto';
import multer from "multer";
const upload = multer({ dest: './uploads/' });

import mongoose from "mongoose"
import { FridgeSnapModel, FoodModel } from "./models.mjs";



import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';



const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));


app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

//talking with the GOOGLE AI 
const apiKey = AIzaSyDG2W5yrCe-nWTeHVXaZfoLHal6b7foUvo;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
 systemInstruction: `
  "Given an image of a food item(s), identify the type and quantity of each distinct food present. 
  Your response should be formatted as follows: <food name> <quantity>, separated by commas. 
  For example, if there are 3 apples and 2 bananas, return apples 3, bananas 2. 
  If the quantity cannot be determined for a particular food, set its quantity as 1 (e.g., bread 1, strawberries 1). 
  If no recognizable food items are present, respond with 'invalid input, try again'. 
  Ensure the output only includes food names and quantities, and avoid adding additional information or comments. 
  Also, make sure that all items are as simple as possible, so a granny smith apple is just an apple. 

  Your return should be of the JSON format { "Foods": [{"name": "food1", "quantity": food1ammount}, {"name": "food2", "quantity": food2quantity}]}

  An example would be:
  { "Foods": [{"name": "carrot", "quantity": 2}, {"name": "banana", "quantity": 1}]}

  Once again, if an item isn't food, your output should be the words 'invalid input, try again'. 
  Animals that are alive should not be considered food items."
`
});

async function processImageWithGemini(file) {
  try {
    if (!file) {
      throw new Error("No file uploaded.");
    }

    // Upload the file to Gemini
    const uploadedFile = await uploadToGemini(file.path, file.mimetype);

    // Start a chat session with the Gemini model
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            },
          ],
        },
      ],
    });

    // Send a message to the AI model
    const result = await chatSession.sendMessage("Identify food in the image.");
    const response = result.response.text();

    // Return the AI model's response
    return response;

  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${port}`);
});







//adding the image 
function addingPhotoToDB(imageupload){
  for (let i = 0; i < 3; i++){
    DB.insert(imageupload, function(err,returnvalue){
      if (err) console.log("wompy wompy this image fucking fucked up this many times " + i);
      return returnvalue;
    });
  }
  return -1;
}


app.post("/api/images/",upload.array('picture'), function(req,res,next){ 
  //basically Im assuming right now that the image just need a unique id, as well as the photo
  req.files.forEach(function(file){
      addingPhotoToDB(file,function(returnvalue){
        if (returnvalue === -1){return res.status(500).send("error adding image into database ");}
        return res.redirect("/");
      });
  })
});



//retriving photo from database 
app.get("/api/images/:count", function(req,res,next){
  DB.find.sort({createdAt:-1}).limit(parseInt(req.params.count)).exec(function(err,photos){
    if (err) return res.status(500).send("cannot send image in database");
    return res.json(photos); //returning list of images
  }); 
});

app.get("/api/images/retriving/:imageid", function(req,res,next){
  DB.findOne({_id:imageid}, function(err, photo){
    if (err) return res.status(500).send("cannot retrive image in database");
    res.setHeader('Content-Type', photo.mimetype);
    return res.sendFile(image.path, {root:"./"});
  })
});





// create

app.post("/api/fridgesnap", (req, res) => {
    
})

// read

app.get("/api/test", async (req, res) => {
    return res.json({ message: "Hello, World ✌️" });
});

//

// delete

// app.get("/images", async (req, res) => {
//     const allDogs = await Dog.find();
//     return res.status(200).json(allDogs);
// });
  
// app.get("/images/:", async (req, res) => {
//     const { id } = req.params;
//     const dog = await Dog.findById(id);
//     return res.status(200).json(dog);
// });

import {connectDB} from "./db.mjs"


export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
connectDB().catch((err) => console.log(err));
  