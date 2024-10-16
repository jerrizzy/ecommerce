import { React, useEffect } from 'react';
import { useLoaderData, useParams } from "react-router-dom"

function ProductPage() {
  // const { id } = useParams(); // we get the id from the URL parameters using this hook, and we capture the dynamic part of the URL that identifies a specific restaurant
  const [foundProduct, setFoundProduct] = ([])
  const products = useLoaderData()
  console.log(products.name)

  // useEffect(() => {
  //   const product = products.find(product => product.id === id);
  //   if (product) {
  //     setFoundProduct(product);
  //   }

  // }, [id, products])

  if (!products) {
    return <div>Loading...</div>;  // Handle if item is not found or data is still loading
  }

  return (
    <div>
      <h1>Item details</h1>
      <img src={products.image} />
      <h2>{products.name}</h2>
      <p>Brand: {products.brand}</p>
      <p>Description: {products.description}</p>
      <p>Available quantity: {products.quantity}</p>
      <p>Rating: {products.rating}/5</p>
    </div>
  )
}

export default ProductPage