import RecipeModel from './model.js'; // Import the Recipe model
import UserModel from '../Users/model.js'; // Import the User model
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

    app.post("/api/recipes/like", likeRecipe);

    const getLikedRecipes = async (req, res) => {
        const { userId } = req.params;
        const apiKey = process.env.SPOONACULAR_API_KEY;
    
        try {
            // Fetch the user's liked recipe IDs
            const user = await UserModel.findById(userId);
            const recipeIds = user.likedRecipes; // Assume this is an array of IDs
    
            // Fetch details for each recipe ID concurrently
            const recipeDetails = await Promise.all(
                recipeIds.map(async (id) => {
                    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
                    return response.data;
                })
            );
    
            // Send the full recipe details back
            res.json(recipeDetails);
        } catch (error) {
            console.error("Error fetching liked recipes:", error.message);
            res.status(500).json({ error: "Failed to fetch liked recipes." });
        }
    };
    
    app.get("/api/recipes/liked/:userId", getLikedRecipes);
    


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
    // app.get('/api/recipes', findAllRecipes);         // Route to fetch all recipes      // Route to like a recipe
    app.post('/api/users/follow', followChef);       // Route to follow a chef// Route to fetch liked recipes
    app.get('/api/users/:userId/following', findFollowedChefs);   // Route to fetch followed chefs
}
