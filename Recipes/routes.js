import RecipeModel from './model.js'; // Import the Recipe model
import UserModel from '../Users/model.js'; // Import the User model

export default function RecipeRoutes(app) {

    // Fetch all recipes
    const findAllRecipes = async (req, res) => {
        try {
            const recipes = await RecipeModel.find();
            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch recipes", error });
        }
    };

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

    // Define routes
    app.get('/api/recipes', findAllRecipes);         // Route to fetch all recipes
    app.post('/api/recipes/like', likeRecipe);       // Route to like a recipe
    app.get('/api/users/:userId/likedRecipes', findLikedRecipes); // Route to fetch liked recipes
}