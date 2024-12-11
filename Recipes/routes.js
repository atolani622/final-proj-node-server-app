import * as dao from './dao.js';

export default function RecipeRoutes(app) {

const findAllRecipes = async (req, res) => {
    const users = await dao.findAllRecipes();
    res.json(users);
};

app.get('/api/recipes', findAllRecipes);



}