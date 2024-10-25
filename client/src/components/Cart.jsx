import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from "react-router-dom"
import "./Cart.css";

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
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="cart-item-image">
              <img src={item.image_url || 'placeholder.jpg'} alt={item.title || 'Product'} />
            </div>
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p className="cart-item-price">${item.price}</p>
              <p>In Stock</p>
              <p>Quantity: <select defaultValue={item.quantity}>
                {[...Array(10).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
              </select></p>
              <div className="cart-item-actions">
                <button className="cart-item-delete">Delete</button>
                <button className="cart-item-save">Save for later</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;
