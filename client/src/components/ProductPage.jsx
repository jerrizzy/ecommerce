import { React, useEffect } from 'react';
import { useLoaderData } from "react-router-dom"

function ProductPage() {
  const { id } = useParams(); // we get the id from the URL parameters using this hook, and we capture the dynamic part of the URL that identifies a specific restaurant
  const [foundProduct, setFoundProduct] = (null)
  const products = useLoaderData()

  useEffect(() => {
    const product = products.find(product => product.id === id);
    if (product) {
      setFoundProduct(product);
    }

  }, [id, products])

  if (!foundProduct) {
    return <div>Loading...</div>;  // Handle if item is not found or data is still loading
  }

  return (
    <div>
      <h1>Item details</h1>
      <img src={foundProduct.image} />
      <h2>{foundProduct.name}</h2>
      <p>Brand: {foundProduct.brand}</p>
      <p>Description: {foundProduct.description}</p>
      <p>Available quantity: {foundProduct.quantity}</p>
      <p>Rating: {foundProduct.rating}/5</p>
    </div>
  )
}

export default ProductPage