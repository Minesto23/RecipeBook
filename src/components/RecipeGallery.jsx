import RecipeCard from './RecipeCard'

const RecipeGallery = ({ recipes, onSelectRecipe }) => {
  return (
    <section className="gallery-section">
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={() => onSelectRecipe(recipe)} 
          />
        ))}
      </div>
      {recipes.length === 0 && (
        <div style={{textAlign: 'center', margin: '4rem 0', color: 'var(--color-text-muted)'}}>
          <p>No se encontraron recetas con esa búsqueda.</p>
        </div>
      )}
    </section>
  )
}

export default RecipeGallery
