import React, { useState } from 'react'

function NewProduct() {
  // Initializing a blank form state. An object with the following properties
  const blankForm = {
    id: null,
    image: '',
    name: '',
    description: '',
    price: '',
  }

  // State to hold the form data
  const [formData, setFormData] = useState(blankForm)
  const [error, setError] = useState()

  function handleSubmit(event) {
    event.preventDefault()
    fetch('http://localhost:8000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(resp => {
      if (resp.ok) {
        return resp.json()
      } else {
        return Promise.reject(resp)
      }
    })
    .then(data => console.log(data))
    .catch(resp => resp.json())
    .then(errorData => setError(errorData))
  }

  function handleNameChange(event) {
    setFormData({...formData, name: event.target.value })
  }

  function handlePriceChange(event) {
    setFormData({...formData, price: event.target.value })
  }

  function handleDescriptionChange(event) {
    setFormData({...formData, description: event.target.value})
  }

  function handleImageChange(event) {
    setFormData({...formData, image: event.target.value})
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
    <label>Image URL: </label>
    <input name="imageUrl" type="text" onChange={handleImageChange} value={formData.image} /><br />
      <label>Name: </label>
      <input name="name" type="text" onChange={handleNameChange} value={formData.name} /><br />
      <label>Description: </label>
      <input name="description" type="text" onChange={handleDescriptionChange} value={formData.description} /><br />
      <label>Price: </label>
      <input name="price" type="number" onChange={handlePriceChange} value={formData.price} /><br />
      <button type="submit" className="submit-button">Add Product</button>
    </form>
    </div>
  )
}


export default NewProduct