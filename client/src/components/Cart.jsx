import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from "react-router-dom"
import "./Cart.css";

// TODO: link a product back to its product page

function Cart() {
  const { cart, setCart, checkoutToken, dataProduct, setDataProduct } = useOutletContext();
  const [subtotal, setSubtotal] = useState(0);

  console.log('in the cart: ', cart)
  console.log('Redirecting with checkout token:', checkoutToken);

  const password = 'giclab';

  // Calculate subtotal whenever the cart changes
  useEffect(() => {
    setSubtotal(calculateSubtotal());
  }, [cart]);


  function calculateSubtotal () {
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
      subtotal += cart[i].quantity * cart[i].price; // Add each item's total to subtotal
    }
    return subtotal
  }

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value, 10);
  
    // Find the item in the cart by ID to check available stock
    const item = cart.find(item => item.id === itemId);
    
    // Check if new quantity exceeds available stock
    if (newQuantity > item.quantity) { // Assuming 'availableStock' is the correct key for stock
      alert('Quantity exceeds available stock');
      return; // Exit the function to avoid updating the cart
    }
  
    // Proceed to update the cart with the new quantity
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
  
    setCart(updatedCart); // Update cart in state
  };

  const handleDelete = (id) => {
    // Delete item from the cart
    // TODO: implement the logic to delete an item from the cart
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
  };

  const handleSaveForLater = () => {
    // Save item for later
    // TODO: implement the logic to save an item for later
  };
  


  const handleCheckout = () => {
    // Redirect to Shopify checkout page
    if (checkoutToken) {
      window.location.href = `https://quickstart-f138a90f.myshopify.com/checkouts/${checkoutToken}?password=${password}`;
    } else {
      console.error("Checkout token is missing!");
    }
  };

  return (
    <div className="shopping-cart">
  <h2>Your Shopping Cart</h2>
  {cart.length > 0 ? (
    <>
      {cart.map((item, index) => (
        <div className="cart-item" key={index}>
          <div className="cart-item-image">
            <Link to={`/productpage/${item.id}`}>
              <img src={item.image_url} alt={item.title} />
            </Link>

          </div>
          <div className="cart-item-details">
            <h3>{item.title}</h3>
            <p className="cart-item-price">${item.price}</p>
            <p>In Stock</p>
                <p>Quantity: 
                  <select 
                    value={item.quantity} // Bind to item quantity for controlled component
                    onChange={(e) => handleQuantityChange(e, item.id)}
                  >
                    {[...Array(10).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                  </select>
                </p>
            <div className="cart-item-actions">
              <button type="button" onClick={() => handleDelete(item.id)} className="cart-item-delete">Delete</button>
              <button className="cart-item-save">Save for later</button>
            </div>
          </div>
        </div>
      ))}
      <h3 style={{color: 'black'}}>Subtotal: ${calculateSubtotal().toFixed(2)}</h3> {/* Display subtotal here */}
    </>
  ) : (
    <p style={{color: 'green'}}>Your cart is empty</p>
  )}
  <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
</div>
  );
}

export default Cart;
