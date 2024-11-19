import ProductCard from './ProductCard'
import { useOutletContext } from 'react-router-dom'
import { useState } from 'react';

function ProductList() {
  const { productList } = useOutletContext();
  
  return (
    <div>
      <div className="product-list">
        {productList.map((product) => (
          <ProductCard 
          key={product.id}
          product={product}
          />
        ))}
      </div>

    </div>
  )
}

export default ProductList