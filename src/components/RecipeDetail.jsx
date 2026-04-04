import { ArrowLeft, Clock, Tag, Users } from 'lucide-react'

const RecipeDetail = ({ recipe, onBack }) => {
  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Volver al inicio
      </button>

      <div className="detail-header">
        <h2 className="detail-title">{recipe.title}</h2>
        <div className="card-tags">
          <span className="tag category">
            <Tag size={16} />
            {recipe.category}
          </span>
          <span className="tag">
            <Clock size={16} />
            {recipe.prepTime}
          </span>
          <span className="tag">
            <Users size={16} />
            {recipe.servings} Porciones
          </span>
        </div>
      </div>

      <img src={recipe.image || 'https://via.placeholder.com/800x400?text=Receta'} alt={recipe.title} className="detail-image" />

      <div className="detail-content">
        <div className="ingredients-list">
          <h3>Ingredientes</h3>
          {recipe.ingredients.map((ing, idx) => (
            <label key={idx} className="ingredient-item">
              <input type="checkbox" />
              <span><strong>{ing.amount}</strong> de {ing.name}</span>
            </label>
          ))}
        </div>

        <div className="instructions-list">
          <h3>Preparación</h3>
          {recipe.instructions.map((step, idx) => (
            <div key={idx} className="instruction-item">
              <div className="instruction-number">{idx + 1}</div>
              <p>{step}</p>
            </div>
          ))}

          {recipe.notes && (
            <div className="detail-notes">
              <p>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
