import { Link } from 'react-router-dom';
import useRecipeStore from '../recipeStore';

const RecipeList = () => {
  const filteredRecipes = useRecipeStore((state) => state.filteredRecipes);
  const recipes = useRecipeStore((state) => state.recipes);
  const searchTerm = useRecipeStore((state) => state.searchTerm);

  const displayedRecipes = searchTerm ? filteredRecipes : recipes;

  return (
    <div>
      {displayedRecipes.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-semibold">
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </h3>
          <p className="text-gray-600">{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
