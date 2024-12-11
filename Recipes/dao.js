import model from "./model.js";
import UserModel from '../Users/model.js'

export const findAllRecipes = () => model.find();
export const likeRecipe = async (userId, recipeId) => {
    await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { likedRecipes: recipeId },
    });
};

