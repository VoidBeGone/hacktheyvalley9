import mongoose from "mongoose"
import { FridgeSnapModel, FoodModel } from "./models.mjs";

const uri = "mongodb+srv://jasonsqian:RY98MRmDSfduc1rK@refridge.drymp.mongodb.net/?retryWrites=true&w=majority&appName=Refridge";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
export async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    console.log("try to ping")
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

export async function addFridgeSnap(fs) {
    const result = await mongoose.connection.db.collection("refridge").insertOne(fs);
    console.log("inserted fs with id "+result.insertedId);
    return result.insertedId;
}

export async function getFridgeSnaps(uid) {
    const result = await mongoose.connection.db.collection("refridge").find({uid});
    return result;
}

export async function initDB() {
}

export async function pingDB() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("PINGED");
    } finally {
        await mongoose.disconnect();
    }
}