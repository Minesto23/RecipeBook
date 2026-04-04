import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../services/firebase'

const AddRecipeForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Plato Principal')
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }])
  const [instructions, setInstructions] = useState([''])
  const [notes, setNotes] = useState('')

  const handleAddIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }])
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index))
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const handleAddInstruction = () => setInstructions([...instructions, ''])
  const handleRemoveInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index))
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = ''
      
      // Si el usuario seleccionó una imagen, subirla a Firebase Storage primero
      if (imageFile) {
        const imageRef = ref(storage, `recipes/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      // Preparar el documento de la receta
      const newRecipeData = {
        title,
        category,
        prepTime: `${prepTime} min`,
        servings,
        image: imageUrl || 'https://via.placeholder.com/800x400?text=Foto+Pendiente', // fallback
        ingredients: ingredients.filter(i => i.name && i.amount),
        instructions: instructions.filter(i => i.trim() !== ''),
        notes,
        createdAt: new Date().toISOString()
      }

      // Guardar en Firestore
      await addDoc(collection(db, 'recipes'), newRecipeData)
      
      // Volver al home
      onSave()
    } catch (error) {
      console.error("Error al guardar la receta: ", error)
      alert("Hubo un error al guardar. Asegúrate de tener permisos en Firebase.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-recipe-container">
      <h2>Añadir Nueva Receta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título de la receta</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Pollo Asado de la Abuela" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option>Plato Principal</option>
              <option>Entrante</option>
              <option>Sopa</option>
              <option>Postre</option>
              <option>Bebida</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tiempo de Preparación (min)</label>
            <input type="number" required value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="Ej. 45" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Porciones</label>
            <input type="number" required value={servings} onChange={e => setServings(e.target.value)} placeholder="Ej. 4" />
          </div>
          <div className="form-group">
            <label>Subir Fotografía</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setImageFile(e.target.files[0])} 
              style={{border: 'none', padding: '0.4rem 0'}}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ingredientes</label>
          <div className="dynamic-list">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-item">
                <input type="text" placeholder="Cantidad (ej. 200g)" value={ing.amount} onChange={e => handleIngredientChange(idx, 'amount', e.target.value)} required />
                <input type="text" placeholder="Ingrediente" value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} required />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => handleRemoveIngredient(idx)} style={{background:'none', border:'none', color:'var(--color-primary)', cursor:'pointer'}}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary" onClick={handleAddIngredient}>
            <Plus size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight:'4px'}} /> 
            Añadir Ingrediente
          </button>
        </div>

        <div className="form-group" style={{marginTop: '2rem'}}>
          <label>Instrucciones Paso a Paso</label>
          <div className="dynamic-list">
            {instructions.map((inst, idx) => (
              <div key={idx} className="dynamic-item">
                <span className="instruction-number" style={{width:'38px', height:'38px', fontSize:'0.9rem'}}>{idx + 1}</span>
                <input type="text" placeholder="Describe el paso..." value={inst} onChange={e => handleInstructionChange(idx, e.target.value)} required />
                {instructions.length > 1 && (
                  <button type="button" onClick={() => handleRemoveInstruction(idx)} style={{background:'none', border:'none', color:'var(--color-primary)', cursor:'pointer'}}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary" onClick={handleAddInstruction}>
            <Plus size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight:'4px'}} /> 
            Añadir Paso
          </button>
        </div>

        <div className="form-group" style={{marginTop: '2rem'}}>
          <label>Notas Adicionales / Secretos de Familia</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej. El secreto es remover a fuego muy lento..." />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={isSubmitting} style={{background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer', fontWeight:'500'}}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando en la nube...' : 'Guardar Receta'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRecipeForm
