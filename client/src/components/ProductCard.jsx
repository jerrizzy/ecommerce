import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

function ProductCard({ id, product }) {
  // State to manage whether the product is added to the cart
  const [checkoutId, setCheckoutId] = useState(null);
  const [cart, setCart] = useState([]);

  // Create checkout if not already created
  useEffect(() => {
    const fetchCheckout = async () => {
      const response = await fetch('http://localhost:3000/api/create-checkout', { method: 'POST' });
      const checkout = await response.json();
      console.log('Checkout created:', checkout);  // Log the checkout object
      setCheckoutId(checkout.id);  // Save checkout ID
    };

    if (!checkoutId) {
      fetchCheckout();
    }
  }, [checkoutId]);

  // Function to add the product to the cart
  // Handle adding item to cart without redirecting
  const handleAddToCart = async () => {
    if (!checkoutId) {
      console.error('Checkout not initialized');
      return;
    }

    const variantId = product.variants[0].id;  // Get the variant ID
    const quantity = 1;  // You can change this to dynamic quantity
    const response = await fetch('http://localhost:3000/api/add-to-cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutId,
        variantId,
        quantity,
      })
    });

    const updatedCheckout = await response.json();
    setCart(updatedCheckout.line_items);  // Update cart state
  };



  return (
    
   
    <div className="product-card">
      <Link to={`/productpage/${product.id}`}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      </Link>
      <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
    </div>

  
  )
}

export default ProductCard