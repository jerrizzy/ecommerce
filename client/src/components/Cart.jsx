import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from "react-router-dom"
import "./Cart.css";

// TODO: link a product back to its product page

function Cart() {
  const { productList, cart, setCart, checkoutToken, checkoutUrl } = useOutletContext();
  const [subtotal, setSubtotal] = useState(0);

  console.log('ProductList: ', productList)
  console.log('in the cart: ', cart)
  console.log('Redirecting with checkout token:', checkoutToken);
  console.log('Redirecting to checkout URL:', checkoutUrl);



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

    console.log('Looking for itemId:', itemId);
    console.log('Product List IDs:', productList.map(item => item.id));
  
    // Find the product in productList to check stock availability
    const cartItem = cart.find(item => item.id === itemId);
    const product = productList.find(item => item.id === cartItem.originalProductId);

    if (!product) {
      console.error('Product not found for itemId:', itemId);
      return;
    }
    
    // Check if new quantity exceeds available stock
    if (newQuantity > product.quantity) { 
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
      window.location.href = `https://1qdctu-rm.myshopify.com/checkouts/${checkoutToken}`;
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
            <Link to={`/productpage/${item.originalProductId.split("/").pop()}`}>
              <img src={item.image} alt={item.title} />
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
