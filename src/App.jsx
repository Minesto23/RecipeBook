import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import jsPDF from 'jspdf'
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
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from('recipes').select('*').order('createdat', { ascending: false });
      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();

    // Suscripción a cambios en tiempo real
    const channel = supabase.channel('recipes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, payload => {
        fetchRecipes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const handleEditRecipeView = (recipe) => {
    setSelectedRecipe(recipe)
    setCurrentView('add') // Usamos AddRecipeForm pero pasándole la receta
  }

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta receta permanentemente?")) {
      const { error } = await supabase.from('recipes').delete().eq('id', id)
      if (error) {
        alert("Error eliminando receta.")
      } else {
        handleNavigateHome()
      }
    }
  }

  const handleSeedData = async () => {
    try {
      setLoading(true);
      for (const recipe of initialRecipes) {
        const { id, ...recipeData } = recipe;
        const { error } = await supabase.from('recipes').insert([recipeData]);
        if (error) console.error(error);
      }
      alert('Datos iniciales cargados en Supabase!');
    } catch (e) {
      console.error('Error al subir mock data:', e);
      alert('Hubo un error subiendo los datos.');
    } finally {
      setLoading(false);
    }
  }

  const getBase64ImageFromUrl = async (imageUrl) => {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
      reader.onerror = () => reject(this);
      reader.readAsDataURL(blob);
    })
  }

  const handleExportPDF = async () => {
    const doc = new jsPDF()

    // Portada
    doc.setFillColor(252, 248, 242) // Tonos crema/pergamino
    doc.rect(0, 0, 210, 297, 'F')
    
    // Titulo
    doc.setTextColor(139, 0, 0) // Granate
    doc.setFont("helvetica", "bold")
    doc.setFontSize(36)
    doc.text("Recetario de la Familia", 105, 120, null, null, "center")

    doc.setFontSize(18)
    doc.setTextColor(100, 100, 100)
    doc.text("Nuestras mejores recetas", 105, 140, null, null, "center")

    try {
      // Intentar cargar logo para la portada
      const logoUrl = new URL('./assets/logo.png', import.meta.url).href
      if (!logoUrl.includes('undefined')) {
        const b64 = await getBase64ImageFromUrl(logoUrl)
        doc.addImage(b64, 'PNG', 80, 50, 50, 50)
      }
    } catch (e) {
      console.warn("No logo included", e)
    }

    // Iterar páginas de recetas
    let yOffset = 30
    
    recipes.forEach((recipe, idx) => {
      doc.addPage() // Nueva página por receta para que se vea más premium
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, 210, 297, 'F')
      
      doc.setTextColor(139, 0, 0)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(recipe.title, 20, 30)

      doc.setDrawColor(139, 0, 0)
      doc.setLineWidth(0.5)
      doc.line(20, 35, 190, 35)
      
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(12)
      doc.setFont("helvetica", "italic")
      doc.text(`${recipe.category} | ${recipe.preptime} | ${recipe.servings} Porciones`, 20, 45)

      yOffset = 60

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Ingredientes:", 20, yOffset)
      yOffset += 10
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          doc.text(`• ${ing.amount} de ${ing.name}`, 25, yOffset)
          yOffset += 8
        })
      }

      yOffset += 5
      if (yOffset > 250) {
        doc.addPage()
        yOffset = 30
      }

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Preparación:", 20, yOffset)
      yOffset += 10
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      if (recipe.instructions) {
        recipe.instructions.forEach((inst, i) => {
          const splitText = doc.splitTextToSize(`${i + 1}. ${inst}`, 160)
          doc.text(splitText, 25, yOffset)
          yOffset += 8 * splitText.length
        })
      }
      
      if (recipe.notes) {
        yOffset += 5
        doc.setFillColor(252, 248, 242)
        doc.rect(20, yOffset - 5, 170, 25, 'F')
        doc.setTextColor(139, 0, 0)
        doc.setFontSize(12)
        doc.setFont("helvetica", "italic")
        const splitNotes = doc.splitTextToSize(`Nota: ${recipe.notes}`, 160)
        doc.text(splitNotes, 25, yOffset + 5)
        doc.setTextColor(0,0,0)
      }

      // Paginación
      doc.setFontSize(10)
      doc.text(`Página ${idx + 2}`, 105, 290, null, null, "center")
    })

    doc.save("recetario_familiar.pdf")
  }

  const handleExportShoppingList = (recipe) => {
    const doc = new jsPDF()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.text("Lista de Compra", 105, 20, null, null, "center")
    
    doc.setFontSize(16)
    doc.setTextColor(139, 0, 0)
    doc.text(recipe.title, 105, 30, null, null, "center")
    
    doc.setDrawColor(139, 0, 0)
    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    
    let yOffset = 50
    if (recipe.ingredients) {
      recipe.ingredients.forEach(ing => {
        // Dibujar un cuadrito [ ]
        doc.setDrawColor(0,0,0)
        doc.rect(20, yOffset - 4, 5, 5)
        doc.text(`${ing.amount} de ${ing.name}`, 30, yOffset)
        yOffset += 10
      })
    }

    doc.save(`compra_${recipe.title.replace(/\s+/g, '_')}.pdf`)
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
        onExportPDF={handleExportPDF}
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
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={handleNavigateHome} 
            onEdit={() => handleEditRecipeView(selectedRecipe)}
            onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
            onExportShopping={() => handleExportShoppingList(selectedRecipe)}
          />
        )}

        {currentView === 'add' && (
          <AddRecipeForm 
            onSave={handleNavigateHome} 
            onCancel={handleNavigateHome} 
            existingRecipe={selectedRecipe}
          />
        )}
      </main>
    </div>
  )
}

export default App
