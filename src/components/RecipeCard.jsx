import { Clock, Tag } from 'lucide-react'

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={recipe.image || 'https://via.placeholder.com/400x300?text=Receta'} alt={recipe.title} />
      </div>
      <div className="card-content">
        <div className="card-tags">
          <span className="tag category">
            <Tag size={12} />
            {recipe.category}
          </span>
          <span className="tag prep-time">
            <Clock size={12} />
            {recipe.preptime}
          </span>
        </div>
        <h3 className="card-title">{recipe.title}</h3>
      </div>
    </div>
  )
}

export default RecipeCard
