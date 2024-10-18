import ProductCard from './ProductCard'
import { useLoaderData } from 'react-router-dom'

function ProductList() {
  const products = useLoaderData()

  console.log(products)

  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
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