import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom"

function Cart() {
  const [checkoutId, setCheckoutId] = useState(null);
  const { cart, setCart } = useOutletContext();

  console.log('in the cart: ', cart)

  const handleCheckout = () => {
    // Redirect to Shopify checkout page
    if (checkoutId) {
      window.location.href = `https://quickstart-f138a90f.myshopify.com/checkouts/${checkoutId}`;
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <li key={index}>
              <img src={item.image_url} alt={item.title} />
              <p>{item.title}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </ul>
      <button onClick={handleCheckout}>Go to Checkout</button>
    </div>
  );
}

export default Cart;
