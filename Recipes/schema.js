import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true},
    image: String,
    description: String,
    ingredients: { type: [String], required: true },
    instructions: [String],
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["MAIN", "DESSERT", "SIDE", "BEVERAGE"],
      default: "MAIN" },
  },
  { collection: "recipes" });
export default recipeSchema;

