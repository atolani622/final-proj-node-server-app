import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
    recipeId: { type: String, required: true},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default model("Review", ReviewSchema);
