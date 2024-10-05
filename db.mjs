import mongoose from "mongoose"

const uri = "mongodb+srv://jasonsqian:RY98MRmDSfduc1rK@refridge.drymp.mongodb.net/?retryWrites=true&w=majority&appName=Refridge";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
export async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
connectDB;
