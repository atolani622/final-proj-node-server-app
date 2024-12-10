import { Router } from 'express';
const router = Router();

// Sample recipe data
let recipes = [
    {
        id: 1,
        title: 'Spaghetti Bolognese',
        description: 'A classic Italian pasta dish with rich meat sauce.',
        imageUrl: 'https://via.placeholder.com/150',
        likes: 5
    },
    {
        id: 2,
        title: 'Chicken Curry',
        description: 'A spicy and flavorful curry made with tender chicken pieces.',
        imageUrl: 'https://via.placeholder.com/150',
        likes: 10
    },
  {
        id: 3,
        title: 'Pumpkin Pie',
        description: 'A tasty pumpkin pie for the family to enjoy',
        imageUrl: 'https://via.placeholder.com/150',
        likes: 15
    }
];

// Get all recipes
router.get('/', (req, res) => {
    res.json(recipes);
});

// Get a single recipe by ID
router.get('/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
});

// Add a new recipe
router.post('/', (req, res) => {
    const newRecipe = {
        id: recipes.length + 1,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl || 'https://via.placeholder.com/150',
        likes: 0
    };
    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

// Update a recipe by ID
router.put('/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.imageUrl = req.body.imageUrl || recipe.imageUrl;
    res.json(recipe);
});

// Delete a recipe by ID
router.delete('/:id', (req, res) => {
    const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
    if (recipeIndex === -1) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    recipes.splice(recipeIndex, 1);
    res.status(204).send();
});

export default router;
