import { useParams } from 'react-router-dom';
import useRecipeStore from '../recipeStore';

const RecipeDetails = () => {
  const { recipeId } = useParams(); // Get the recipe ID from the URL
  const recipe = useRecipeStore((state) =>
    state.recipes.find((recipe) => recipe.id === Number(recipeId))
  );

  if (!recipe) {
    return <div>Recipe not found!</div>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeDetails;
