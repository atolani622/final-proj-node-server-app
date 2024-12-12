import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
    recipeId: { type: String, required: true },
    user: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
});

export default model('Review', reviewSchema);
