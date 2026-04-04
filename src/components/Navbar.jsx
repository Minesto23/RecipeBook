import { Search, Plus } from 'lucide-react'

const Navbar = ({ onNavigateHome, onAddRecipe, searchQuery, setSearchQuery }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onNavigateHome}>
        <img src="/vite.svg" alt="Logo" width="32" height="32" />
        <h1>Recetario de la Familia</h1>
      </div>
      
      <div className="navbar-actions">
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por ingrediente o nombre..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="btn-primary" onClick={onAddRecipe}>
          <Plus size={20} />
          Añadir Nueva Receta
        </button>
      </div>
    </nav>
  )
}

export default Navbar
