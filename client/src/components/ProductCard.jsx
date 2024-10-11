import { Link } from "react-router-dom"

function ProductCard({ id, name, image }) {
  return (
    <Link to={`/products/${id}`}>
   
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{price}</p>
      <button className="add-to-cart">Add to Cart ��</button>
    </div>
    
    </Link>
  )
}

export default ProductCard