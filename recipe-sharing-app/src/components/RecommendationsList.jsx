import useRecipeStore from '../recipeStore';

const RecommendationsList = () => {
  const recommendations = useRecipeStore((state) => state.recommendations);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
      {recommendations.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <p className="text-gray-600">{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
