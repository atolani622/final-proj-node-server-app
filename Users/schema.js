import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    lastName: String,
    dob: Date,
    likedRecipes: [Object],
    followedChefs: [Object],
    role: {
      type: String,
      enum: ["ADMIN", "STUDENT", "CHEF"],
      default: "STUDENT" },
  },
  { collection: "users" });
export default userSchema;