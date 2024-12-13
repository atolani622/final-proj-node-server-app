import { Router } from "express";
import Review from "./model.js"
const router = Router();

export default function ReviewRoutes(app) {

// Create a new review
const saveReview = async (req, res) => {
    try {
        const { recipeId, userId, rating, comment } = req.body;
        const review = new Review({ recipeId, userId, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        console.error("Failed to save review:", err);
        res.status(500).json({ error: "Failed to save review" });
    }
};
app.post(`/api/reviews`, saveReview);



const getReviewsForRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId; // Recipe ID as a string
        const reviews = await Review.find({ recipeId }).populate("userId", "username");
        res.json(reviews);
    } catch (err) {
        console.error("Failed to fetch reviews:", err);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};


app.get(`/api/reviews/:recipeId`, getReviewsForRecipe);

}