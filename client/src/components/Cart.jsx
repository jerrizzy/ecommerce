import React, { useState, useEffect } from 'react';

function Cart() {
  const [checkoutId, setCheckoutId] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve checkout ID and cart items from localStorage or state
    const savedCheckoutId = localStorage.getItem('checkoutId');
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCheckoutId) setCheckoutId(savedCheckoutId);
    if (savedCart) setCart(savedCart);
  }, []);

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
