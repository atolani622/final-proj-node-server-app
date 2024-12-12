import { Router } from 'express';
import Review from './model.js';
const router = Router();

export default function RouterRoutes(app) {
    
// Submit a review
router.post('/', async (req, res) => {
    const { recipeId, user, text, rating } = req.body;

    try {
        const review = new Review({ recipeId, user, text, rating });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save review' });
    }
});

// Get reviews for a recipe
router.get('/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;

    try {
        const reviews = await find({ recipeId });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

}