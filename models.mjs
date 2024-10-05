import mongoose from "mongoose"

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    }
})

const FridgeSnapSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    date_added: {
      type: Date,
      required: true,
    },
    image_path: {
        type: String,
        required: true
    },
    food: [{
      type: FoodSchema
    }]
  });

export const FoodModel = mongoose.model("FoodModel", FoodSchema);
export const FridgeSnapModel = mongoose.model("ImageModel", FridgeSnapSchema);