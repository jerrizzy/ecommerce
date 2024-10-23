import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

function ProductCard({ id, product }) {
  // State to manage whether the product is added to the cart
  const [checkoutToken, setCheckoutToken] = useState(null);  // Use token as checkout ID
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);  // To track if checkout is still being initialized

  // Create checkout when the component mounts
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        console.log('Starting checkout creation...');

        // Send request to create checkout
        const response = await fetch('http://localhost:3000/api/create-checkout', {
          method: 'POST',
        });

        const data = await response.json();
        console.log('Checkout token from server:', data.token);  // Log the checkout token

        // Ensure token is set
        if (data.token) {
          setCheckoutToken(data.token);  // Save the checkout token in state
          setLoading(false);  // Stop loading once checkout is created
        } else {
          console.error('Checkout token is missing from the response');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error creating checkout:', error);
        setLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchCheckout();
  }, []);  // Only run this once when the component mounts

  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (!checkoutToken) {
      console.error('Checkout not initialized');
      return;
    }

    const variantId = product.variant_id;  // Use the product variant ID

    try {
      console.log(`Adding product variant ${variantId} to checkout ${checkoutToken}`);

      const response = await fetch('http://localhost:3000/api/add-to-cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutToken,  // Use the checkout token
          variantId,
          quantity: 1  // Adjust quantity as needed
        })
      });

      const updatedCheckout = await response.json();
      console.log('Item added to cart:', updatedCheckout.line_items);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/productpage/${product.id}`}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      </Link>
      <button
      disabled={loading}  // Disable if still loading
      onClick={handleAddToCart} 
      className="add-to-cart">
      {loading ? 'Initializing...' : 'Add to Cart'}</button>
    </div>

  
  )
}

export default ProductCard