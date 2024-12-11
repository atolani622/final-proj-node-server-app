import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: String,
    ingredients: { type: String, required: true },
    steps: String,
    chef: String,
    type: {
      type: String,
      enum: ["MAIN", "DESSERT", "SIDE", "BEVERAGE"],
      default: "MAIN" },
  },
  { collection: "recipes" });
export default recipeSchema;