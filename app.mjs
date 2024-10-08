import { createServer } from "http";
import express from "express";

import Datastore from "nedb";

import multer from "multer";
const upload = multer({ dest: './uploads/' });
import { run } from './foodClassifier.mjs';
import {runrecipe } from "./recipeRecommender.mjs";

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));

const FridgeSnapDB = new Datastore({ filename: './db/fridgesnap.db', autoload: true });
const foods = new Datastore({ filename: 'db/food.db', autoload: true, timestampData : true});
const recipes = new Datastore({ filename: 'db/recipe.db', autoload: true, timestampData: true });

async function addingFromGemini(file, uid) {
  try {
    const output = await run(file);
    console.log(output);
    // Check if the output is valid and has the expected structure
    if (output && output.Foods) {
      foods.findOne({ uid: uid }, function(err, uid_food) {
        if (err) return res.status(500).end("Error accessing food database with uid " + uid);
        
        if (uid_food) {
          // If `uid_food` exists, update the food list with the new foods
          let existingFood = uid_food.food;
      
          // Merge the existing food items with the new items in `output.Foods`
          output.Foods.forEach(newFoodItem => {
            const index = existingFood.findIndex(foodItem => foodItem.name === newFoodItem.name);
      
            if (index !== -1) {
              // Food item already exists, update the quantity
              existingFood[index].quantity += newFoodItem.quantity;
            } else {
              // Food item does not exist, add it to the list
              existingFood.push(newFoodItem);
            }
          });
          
          foods.remove({ uid: uid }, {}, function(err, numRemoved) {
            if (err) return console.log(err);
            console.log("poop");
            // Insert the new entry with the merged list
            foods.insert({ uid: uid, food: existingFood }, function(err) {
              if (err) return console.log(err);
              console.log("food inserted!")
            });
          });
        } else {
          // If no entry found, insert a new one with the given foods
          foods.insert({ uid: uid, food: output.Foods }, function(err) {
            if (err) return console.log(err);
            console.log("new uid so new foods list")
          });
        }
      });
      
      console.log("food inserted for uid " + uid);
      return output.Foods;
      //addingRecipeFromGemini();
    } else {
      console.error('Output structure is incorrect:', output);
    }
  } catch (error) {
    console.error('Error in addingFromGemini:', error);
  }
}

async function addingRecipeFromGemini(food) {
  // Fetch food items from the database
  
    console.log("food: " + food)
    // Running the recipe generation
    runrecipe(food)
      .then(recipereturn => {
        // if no food found
        if (recipereturn.startsWith("Please")) {
          console.log("Did not find any food in the image");
          return;
        }
        // Insert the generated recipe into the database
        return new Promise((resolve, reject) => {
          recipes.insert({ recipe: recipereturn }, (err, newDoc) => {
            if (err) {
              return reject(err); // Reject if there's an error
            }
            resolve(newDoc); // Resolve with the inserted document
          });
        });
      })
      .then(newDoc => {
        // Log the result of the recipe insertion
        console.log("Recipe inserted: ", newDoc);
      })
      .catch(err => {
        // Handle any errors in the recipe generation or insertion process
        console.error("Error in the recipe generation or insertion process:", err);
      });
    }


//retriving photo from database 
app.get("/api/fridgesnap/:id/images/:count", function(req,res,next){
  DB.find.sort({createdAt:-1}).limit(parseInt(req.params.count)).exec(function(err,photos){
    if (err) return res.status(500).send("cannot send image in database");
    return res.json(photos); //returning list of images
  }); 
});

// create

app.post("/api/fridgesnap/upload", upload.single("picture"), async (req, res) => {
  console.log('File received:', req.file); // Log the file information
  console.log('Request body:', req.body);  // Log the additional form data (items, uid)

  const items = await addingFromGemini(req.file.path, req.body.uid);
  const uid = req.body.uid;

  const fridgesnap = { 
    date_added: Date.now(), 
    image: req.file,  // The uploaded file information
    food: items,
    uid: uid
  }

  FridgeSnapDB.insert(fridgesnap, async function(err, img) {
    if (err) {
      return res.status(500).json({ message: "Failed to upload FridgeSnap", error: err.message });
    }
    res.status(201).json({ message: "FridgeSnap uploaded successfully", data: fridgesnap });
    await addingRecipeFromGemini(fridgesnap.food);
  });
});


app.get("/api/fridgesnap/:id/generate_recipe", async (req, res) => {
  FridgeSnapDB.findOne({ _id: req.params.id }, async function(err, snap) {
    if (err) {
      return res.status(500).end("erro generating recipe");
    }
    const food = await addingRecipeFromGemini(snap.food);
    return food;
  })
})

// read
app.get("/api/users/:uid/food/generate_recipe", async (req, res) => { 
  foods.findOne( {uid: req.params.uid}, function(err, uid_food) {
      addingRecipeFromGemini(uid_food.food)
        .then((rec) => res.json(rec))
        .catch((err) => res.status(500).end("stupid generation error: "+err.message));
  })
});

app.get("/api/users/:uid/food/", async (req, res) => { 
  foods.findOne( {uid: req.params.uid}, function(err, uid_food) {
    console.log(uid_food);
      res.json(uid_food.food);
  })
});

app.get("/api/users/:uid/recipes", async (req, res) => {
  recipes.find( {uid: req.params.uid}, function(err, recs) {
    if (err)
      return res.status(500).end("Error getting" + req.params.uid + " recipes");
    res.json(recs);
  })
})

app.get("/api/users/:uid/fridgesnaps", async (req, res) => {
    FridgeSnapDB.find( { uid: req.params.uid }, function(err, snaps) {
      console.log(snaps);
      res.json(snaps);
    })
});

app.get("/api/fridgesnap/:id/image", function(req, res) { 
  FridgeSnapDB.findOne({ _id: req.params.id }, function(err, snap){
    console.log(snap);
    if (err) return res.status(500).send("cannot retrieve image in database");
    res.setHeader('Content-Type', snap.image.mimetype);
    return res.sendFile(snap.image.path, {root:"./"});
  })
});

app.get("/api/test", async (req, res) => {
    res.json({ message: "hello" });
})

// 

// delete
export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});

  