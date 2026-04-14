import paellaImg from '../assets/paella_recipe.png'
import flanImg from '../assets/flan_recipe.png'
import lasagnaImg from '../assets/lasagna_recipe.png'

export const initialRecipes = [
  {
    id: '1',
    title: 'Paella Auténtica',
    category: 'Plato Principal',
    preptime: '60 min',
    image: paellaImg,
    servings: 4,
    ingredients: [
      { name: 'Arroz bomba', amount: '400g' },
      { name: 'Gambas o langostinos', amount: '250g' },
      { name: 'Mejillones', amount: '200g' },
      { name: 'Caldo de pescado', amount: '1 litro' },
      { name: 'Azafrán y pimentón', amount: 'al gusto' }
    ],
    instructions: [
      'Preparar el sofrito con tomate, ajo y pimientos.',
      'Añadir el arroz y el azafrán, tostar ligeramente.',
      'Verter el caldo caliente y cocinar a fuego medio.',
      'Colocar los mariscos en la superficie en los últimos 5 minutos.'
    ],
    notes: 'El secreto está en no remover el arroz una vez añadido el caldo para que se forme el socarrat.'
  },
  {
    id: '2',
    title: 'Flan Casero de la Abuela',
    category: 'Postre',
    preptime: '45 min',
    image: flanImg,
    servings: 6,
    ingredients: [
      { name: 'Leche entera', amount: '500ml' },
      { name: 'Huevos', amount: '4 unidades' },
      { name: 'Azúcar blanca', amount: '150g' },
      { name: 'Esencia de vainilla', amount: '1 cucharadita' }
    ],
    instructions: [
      'Preparar el caramelo derritiendo azúcar en una sartén y verter en el molde.',
      'Batir los huevos con el azúcar restante y mezclar con la leche y vainilla.',
      'Verter la mezcla en el molde caramelizado.',
      'Hornear al baño maría a 180°C durante unos 40 minutos o hasta que cuaje.'
    ],
    notes: 'Dejar enfriar completamente en la nevera antes de desmoldar.'
  },
  {
    id: '3',
    title: 'Lasaña Tradicional',
    category: 'Plato Principal',
    preptime: '90 min',
    image: lasagnaImg,
    servings: 8,
    ingredients: [
      { name: 'Láminas de lasaña', amount: '1 paquete' },
      { name: 'Carne picada mixta', amount: '500g' },
      { name: 'Salsa de tomate frito', amount: '400g' },
      { name: 'Queso rallado para gratinar', amount: '150g' },
      { name: 'Salsa bechamel', amount: '500ml' }
    ],
    instructions: [
      'Cocinar la carne picada y mezclar con la salsa de tomate.',
      'Cocer las láminas de pasta según las instrucciones.',
      'Montar la lasaña alternando capas de pasta, carne y bechamel.',
      'Cubrir la última capa con bechamel y queso rallado, luego hornear a 200°C por 20 min.'
    ],
    notes: 'La abuela siempre añadía un poquito de nuez moscada extra a la bechamel.'
  }
];
