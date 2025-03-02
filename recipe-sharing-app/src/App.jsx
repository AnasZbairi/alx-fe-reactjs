import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeDetails from './components/RecipeDetails';
import SearchBar from './components/SearchBar';
import FavoritesList from './components/FavoritesList';
import RecommendationsList from './components/RecommendationsList';

const App = () => {
  return (
    <Router>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Recipe Sharing App</h1>
        <SearchBar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddRecipeForm />
                <FavoritesList />
                <RecommendationsList />
                <RecipeList />
              </>
            }
          />
          <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
