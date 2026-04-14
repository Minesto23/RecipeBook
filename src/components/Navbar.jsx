import { Search, Plus, FileDown } from 'lucide-react'
import logo from '../assets/logo.png'

const Navbar = ({ onNavigateHome, onAddRecipe, onExportPDF, searchQuery, setSearchQuery }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onNavigateHome}>
        <img src={logo} alt="Logo" width="48" height="48" style={{ borderRadius: '8px', objectFit: 'cover' }} />
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
        
        <button className="btn-secondary" onClick={onExportPDF} style={{marginRight: '10px'}} title="Exportar a PDF">
          <FileDown size={20} />
          PDF
        </button>
        <button className="btn-primary" onClick={onAddRecipe}>
          <Plus size={20} />
          Añadir Nueva Receta
        </button>
      </div>
    </nav>
  )
}

export default Navbar
