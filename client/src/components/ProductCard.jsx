import { Link } from "react-router-dom"

function ProductCard({ id, product }) {
  return (
    <Link to={`/productpage/${product.id}`}>
   
    <div className="product-card">
      <img src={product.image} alt={name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button className="add-to-cart">Add to Cart</button>
    </div>

    </Link>
  )
}

export default ProductCard