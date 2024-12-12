import RecipeModel from './model.js'; // Import the Recipe model
import UserModel from '../Users/model.js'; // Import the User model
import * as dao from './dao.js'
import axios from "axios";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export default function RecipeRoutes(app) {

    const getRecipes = async (req, res) => {
        const url = `https://api.spoonacular.com/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=1`;

        const response = await axios.get(url);
        const recipes = response.data;
        res.json(recipes);
    };

    app.get("/api/recipes", getRecipes);

    const getRecipeDetails = async (req, res) => {
        const id = req.params.id;
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;

        const response = await axios.get(url);
        res.json(response.data);
    }

    app.get(`/api/recipes/:id`, getRecipeDetails)

    // Like a recipe (add recipeId to user's likedRecipes array)
    const likeRecipe = async (req, res) => {
        const { userId, recipeId } = req.body;

        try {
            await UserModel.findByIdAndUpdate(userId, {
                $addToSet: { likedRecipes: recipeId },
            });
            res.status(200).json({ message: "Recipe liked successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to like recipe", error });
        }
    };

    // Follow a chef (add chefId to user's following array)
    const followChef = async (req, res) => {
        const { userId, chefId } = req.body;

        try {
            await UserModel.findByIdAndUpdate(userId, {
                $addToSet: { followedChefs: chefId },
            });
            res.status(200).json({ message: "Chef followed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to follow chef", error });
        }
    };

    // Find all liked recipes by a user
    const findLikedRecipes = async (req, res) => {
        const { userId } = req.params;

        try {
            // Fetch the user's likedRecipes (array of recipe IDs)
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const likedRecipeIds = user.likedRecipes;

            // Use the IDs to fetch the full recipe details
            const recipes = await RecipeModel.find({ _id: { $in: likedRecipeIds } });

            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch liked recipes", error });
        }
    };

    // Find all followed chefs by a user
    const findFollowedChefs = async (req, res) => {
        const { userId } = req.params;

        try {
            // Fetch the user's followed chefs (array of user IDs)
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const followedChefs = user.followedChefs;
            res.json(followedChefs)
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch followed chefs", error });
        }
    };

    const searchRecipe = async (req, res) => {
        const query = req.query.query
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${SPOONACULAR_API_KEY}`;

        const response = await axios.get(url);
        res.json(response.data.results)
    }

    app.get(`/api/recipes/search`, searchRecipe);



    // Define routes
    // app.get('/api/recipes', findAllRecipes);         // Route to fetch all recipes
    app.post('/api/recipes/like', likeRecipe);       // Route to like a recipe
    app.post('/api/users/follow', followChef);       // Route to follow a chef
    app.get('/api/users/:userId/likedRecipes', findLikedRecipes); // Route to fetch liked recipes
    app.get('/api/users/:userId/following', findFollowedChefs);   // Route to fetch followed chefs
}
