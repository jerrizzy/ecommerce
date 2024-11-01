import ProductCard from './ProductCard'
import { useLoaderData, Outlet } from 'react-router-dom'

function ProductList() {
  const data = useLoaderData();  // Ensure you're getting the entire response object
  const products = data.products || [];  // Extract the array from the 'products' field
  console.log('products from productList:',products)

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