import React from 'react';
import { useParams } from 'react-router-dom';
import { getAllProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { category } = useParams();
  const all = getAllProducts();
  const products = category ? all.filter(p => p.category.toLowerCase() === category.toLowerCase()) : all;

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All';
  const categoryDescription = category 
    ? `Discover our collection of ${category.toLowerCase()} shoes`
    : 'Discover our collection of premium footwear for every occasion';

  return (
    <section>
      <h1 className="page-title">{categoryTitle} Shoes</h1>
      <p className="page-subtitle">{categoryDescription}</p>
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>We couldn't find any products in this category. Check back soon!</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomePage;
