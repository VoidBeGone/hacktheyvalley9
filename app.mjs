import { createServer } from "http";
import express from "express";

import Datastore from "nedb";

import multer from "multer";
const upload = multer({ dest: './uploads/' });
import { run } from './foodClassifier.mjs';
import {runrecipe } from "./recipeRecommender.mjs";

const PORT = 4000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));


const foods = new Datastore({ filename: 'db/food.db', autoload: true, timestampData : true});
const recipes = new Datastore({ filename: 'db/recipe.db', autoload: true, timestampData: true });

async function addingFromGemini(file) {
  try {
    // Assuming run is an async function
    const output = await run(file);
    console.log(output);
    // Check if the output is valid and has the expected structure
    if (output && output.Foods) {
      output.Foods.forEach(async function(fooditem) {
        try {
          // Assuming `foods.insert` is a function that inserts data into a database
          const food = await foods.insert(fooditem); // Use async/await for better error handling

        } catch (err) {
          console.error('Failed to add food item:', err);
          // Handle the error appropriately, e.g., return an error response in an API
        }
      });
      addingRecipeFromGemini();
    } else {
      console.error('Output structure is incorrect:', output);
    }
  } catch (error) {
    console.error('Error in addingFromGemini:', error);
  }
}

async function addingRecipeFromGemini() {
  // Fetch food items from the database
  foods.find({}).exec((err, foodall) => {
    if (err) {
      console.error("Error fetching food data:", err);
      return;
    }

    // Running the recipe generation
    runrecipe(foodall)
      .then(recipereturn => {
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
  });
}




app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

// dbs

const FridgeSnapDB = new Datastore({ filename: './db/fridgesnap.db', autoload: true });

//talking with the GOOGLE AI 

app.post("/api/documents/",upload.array('picture'), function(req,res,next){ 
  req.files.forEach(function(file) {
      addingPhotoToDB(file,function(returnvalue){
        if (returnvalue === -1){return res.status(500).send("error adding image into database ");}
        return res.redirect("/");
      });
  })
});



//retriving photo from database 
app.get("/api/fridgesnap/:id/images/:count", function(req,res,next){
  DB.find.sort({createdAt:-1}).limit(parseInt(req.params.count)).exec(function(err,photos){
    if (err) return res.status(500).send("cannot send image in database");
    return res.json(photos); //returning list of images
  }); 
});

app.get("/api/images/retriving/:imageid", function(req,res,next){
  DB.findOne({_id:imageid}, function(err, photo){
    if (err) return res.status(500).send("cannot retrieve image in database");
    res.setHeader('Content-Type', photo.mimetype);
    return res.sendFile(image.path, {root:"./"});
  })
});


// create
app.post("/api/fridgesnap/upload", upload.single("picture"), async (req, res) => {
  console.log('File received:', req.file); // Log the file information
  console.log('Request body:', req.body);  // Log the additional form data (items, uid)

  const items = req.body.items;
  const uid = req.body.uid;

  const fridgesnap = { 
    date_added: Date.now(), 
    image: req.file,  // The uploaded file information
    food: items,
    uid: uid
  }

  FridgeSnapDB.insert(fridgesnap, function(err, img) {
    if (err) {
      return res.status(500).json({ message: "Failed to upload FridgeSnap", error: err.message });
    }
    res.status(201).json({ message: "FridgeSnap uploaded successfully", data: fridgesnap });
  });
});

// read

app.get("/api/users/:uid/fridgesnaps", async (req, res) => {
    FridgeSnapDB.find({ }, function(err, snaps) {
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

  