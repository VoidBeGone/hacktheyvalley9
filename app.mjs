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

async function addingFromGemini(file) {
  try {
    const output = await run(file);
    console.log(output);
    // Check if the output is valid and has the expected structure
    if (output && output.Foods) {
      const uid = 0;
      const uid_food = { uid: uid, foos: output.Foods };
      await foods.insert(uid_food);
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
  
    console.log(food)
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

    console.log(req.body);


    const items = await(addingFromGemini(req.file.path));

    console.log("======ITEMS RECIEVED======")
    console.log(items);
    console.log("=========================")


    const uid = req.body.uid;

    const fridgesnap = {  
      date_added: Date.now(), 
      image: req.file,  
      food: items,
      uid: uid
    }

    FridgeSnapDB.insert( fridgesnap, function(err, img) {
      if (err) {
        res.status(500).json({ message: "Failed to upload FridgeSnap", error: error.message });
      }
      res.status(201).json({ message: "FridgeSnap uploaded successfully", data: fridgesnap });
      console.log("done");
      addingRecipeFromGemini();
    })
});


app.get("/api/fridgesnap/:id/generate_recipe", async (req, res) => {
  FridgeSnapDB.findOne({ _id: req.params.id }, function(err, snap) {
    const uid = uid;
    addingRecipeFromGemini();
  })
})

// read
app.get("/api/users/:uid/food/generate_recipe", async (req, res) => { 
  food.findOne( {uid: req.params.uid}, function(err, uid_food) {
      addingRecipeFromGemini(uid_food.food)
        .then((rec) => res.json(rec))
        .catch((err) => res.status(500).end("stupid generation error: "+err.message));
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

  