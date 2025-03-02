import useRecipeStore from '../recipeStore';

const FavoritesList = () => {
  const favorites = useRecipeStore((state) =>
    state.favorites.map((id) => state.recipes.find((recipe) => recipe.id === id))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
      {favorites.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <p className="text-gray-600">{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
