import { ArrowLeft, Clock, Tag, Users, Edit, Trash2, ShoppingCart } from 'lucide-react'

const RecipeDetail = ({ recipe, onBack, onEdit, onDelete, onExportShopping }) => {
  return (
    <div className="recipe-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="back-btn" onClick={onBack} style={{ margin: 0 }}>
          <ArrowLeft size={20} />
          Volver
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={onExportShopping} title="Descargar Lista de Compra">
            <ShoppingCart size={18} />
            <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Lista</span>
          </button>
          <button className="btn-secondary" onClick={onEdit} title="Editar Receta">
            <Edit size={18} />
          </button>
          <button className="btn-secondary" onClick={onDelete} title="Eliminar Receta" style={{ color: 'red', borderColor: '#ffcccc' }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="detail-header">
        <h2 className="detail-title">{recipe.title}</h2>
        <div className="card-tags">
          <span className="tag category">
            <Tag size={16} />
            {recipe.category}
          </span>
          <span className="tag">
            <Clock size={16} />
            {recipe.preptime}
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
