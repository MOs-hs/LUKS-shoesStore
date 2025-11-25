import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <img src={product.image} alt={product.name} className="card-img" />
        <div className="card-body">
          <h3 className="card-brand">{product.brand}</h3>
          <p className="card-name">{product.name}</p>
          <div className="card-price">${product.price.toFixed(2)}</div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
