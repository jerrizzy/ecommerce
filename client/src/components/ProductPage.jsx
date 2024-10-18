import { React, useEffect } from 'react';
import { useLoaderData, useParams } from "react-router-dom"

function ProductPage() {
  // const { id } = useParams(); // we get the id from the URL parameters using this hook, and we capture the dynamic part of the URL that identifies a specific restaurant
  const [foundProduct, setFoundProduct] = ([])
  const products = useLoaderData() // Fetch the specific product
  console.log(products)

  // Find the product that matches the id from the URL from useParams 
  // (we'd use this method only if useLoader was not specified)
  // const foundProduct = products.find(product => product.id === Number(id));

  // If the product is not found, handle the loading or error case
  if (!products) {
    return <div>Loading...</div>;  // Handle if item is not found or data is still loading
  }

  return (
    <div className="product-detail-page">
      <h1>Item details</h1>
      <div className="product-detail">
      <img src={products.image} />
      <div className="product-detail-info">
      <h1>{products.name}</h1>
      <p>Brand: {products.brand}</p>
      <p className="description">Description: {products.description}</p>
      <p className="availability">Available quantity: {products.quantity}</p>
      <p className="price">Price: ${products.price}</p>
      <button className="add-to-cart">Add to Cart</button>
      </div>
      </div>
    </div>
  )
}

export default ProductPage