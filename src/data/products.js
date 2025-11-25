
const seedProducts = [
  {
    id: 'p1',
    name: 'Runner Pro',
    brand: 'StrideCo',
    price: 89.99,
    description: 'Lightweight running shoe with responsive foam.',
    image: 'https://via.placeholder.com/600x600?text=Runner+Pro',
    sizes: ['6','7','8','9','10','11'],
    category: 'Men'
  },
  {
    id: 'p2',
    name: 'CityFlex',
    brand: 'UrbanStep',
    price: 72.5,
    description: 'Everyday sneaker with flexible sole.',
    image: 'https://via.placeholder.com/600x600?text=CityFlex',
    sizes: ['5','6','7','8','9'],
    category: 'Women'
  }
]

export const getAllProducts = () => {
  const raw = localStorage.getItem('products');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('products', JSON.stringify(seedProducts));
  return seedProducts;
};

export const getProductById = (id) => {
  const list = getAllProducts();
  return list.find((p) => p.id === id);
};

export const saveProducts = (list) => {
  localStorage.setItem('products', JSON.stringify(list));
};

export const deleteProduct = (id) => {
  const list = getAllProducts().filter((p) => p.id !== id);
  saveProducts(list);
};
