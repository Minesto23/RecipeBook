import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc } from 'firebase/firestore'
import { db } from './services/firebase'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import RecipeGallery from './components/RecipeGallery'
import RecipeDetail from './components/RecipeDetail'
import AddRecipeForm from './components/AddRecipeForm'
import { initialRecipes } from './data/mockRecipes'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Escuchar cambios en la colección "recipes" de Firestore en tiempo real
    const unsubscribe = onSnapshot(collection(db, 'recipes'), (snapshot) => {
      const recipesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar por fecha o simplemente dejarlos así
      setRecipes(recipesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateHome = () => {
    setCurrentView('home')
    setSelectedRecipe(null)
  }

  const handleAddRecipeView = () => {
    setCurrentView('add')
    setSelectedRecipe(null)
  }

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setCurrentView('detail')
  }

  // Seeder temporal: Sube las 3 recetas base si la DB está vacía
  const handleSeedData = async () => {
    try {
      setLoading(true);
      for (const recipe of initialRecipes) {
        // En Firestore no pasamos el ID, lo generará automáticamente
        const { id, ...recipeData } = recipe;
        await addDoc(collection(db, 'recipes'), recipeData);
      }
      alert('Datos iniciales cargados en Firebase!');
    } catch (e) {
      console.error('Error al subir mock data:', e);
      alert('Hubo un error subiendo los datos. ¿Están bien los permisos de Firestore?');
    } finally {
      setLoading(false);
    }
  }

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (recipe.ingredients && recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  return (
    <div className="app-container">
      <Navbar 
        onNavigateHome={handleNavigateHome} 
        onAddRecipe={handleAddRecipeView} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="main-content">
        {currentView === 'home' && (
          <>
            <Hero />
            {loading ? (
              <div style={{textAlign: 'center', padding: '4rem'}}>Cargando recetas desde la nube...</div>
            ) : (
              <>
                {recipes.length === 0 && (
                  <div style={{textAlign: 'center', margin: '2rem'}}>
                    <p>Tu recetario está vacío.</p>
                    <button className="btn-primary" style={{margin:'1rem auto'}} onClick={handleSeedData}>
                      Cargar Recetas Clásicas de Prueba
                    </button>
                  </div>
                )}
                <RecipeGallery recipes={filteredRecipes} onSelectRecipe={handleSelectRecipe} />
              </>
            )}
          </>
        )}

        {currentView === 'detail' && selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} onBack={handleNavigateHome} />
        )}

        {currentView === 'add' && (
          <AddRecipeForm onSave={handleNavigateHome} onCancel={handleNavigateHome} />
        )}
      </main>
    </div>
  )
}

export default App
