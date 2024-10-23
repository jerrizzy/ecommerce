import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom"

function Cart() {
  const [checkoutId, setCheckoutId] = useState(null);
  const { cart, setCart } = useOutletContext();

  console.log(cart)



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
        {cart.map((item) => (
          <li key={item.id}>
            {item.title} - {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Go to Checkout</button>
    </div>
  );
}

export default Cart;
