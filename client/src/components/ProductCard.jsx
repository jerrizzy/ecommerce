import { useState, useEffect } from 'react'
import { Link, useOutletContext, Outlet } from "react-router-dom"

function ProductCard({ id, product }) {
  const { cart, setCart, checkoutToken, setCheckoutToken } = useOutletContext(); 
  const [loading, setLoading] = useState(false);  // To track if checkout is still being initialized
  console.log("product with quantity field:", product)
  const [quantity, setQuantity] = useState(product.quantity || 0); // To track

  useEffect(() => {
    setQuantity(product.quantity || 0); // Update quantity if product quantity changes
  }, [product.quantity]);  


  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (!checkoutToken) {
      setLoading(true);
      console.error('Checkout not initialized');
      return;
    }
  
    const variantId = `gid://shopify/ProductVariant/${product.variant_id}`;
  
    try {
      const response = await fetch('http://localhost:3000/api/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutToken: `gid://shopify/Checkout/${checkoutToken}`,
          variantId,
          quantity: 1,
        })
      });
  
      const updatedCheckout = await response.json();
      
      // Map the Shopify response to match the simplified product structure
      const newCartItems = updatedCheckout.line_items.map(item => ({
        id: item.id,                  // Shopify item ID
        name: item.title,             // Title from Shopify response
        price: item.price,            // Price from Shopify response
        image: item.image_url,        // Match to your 'product.image' format
        quantity: item.quantity,      // Quantity in the cart
        variant_id: item.variant_id,  // Variant ID for reference
        originalProductId: product.id, // Store original product ID here
      }));
      
      // Update cart state with unified data structure
      setCart([...cart, ...newCartItems]);
  
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
      {quantity > 0 ? (
      <button
      type="button"  // Use a button for simplicity, but you could use a link or a custom button component for more complex scenarios  
      // or Use the loading state to disable the button while the checkout is being initialized or the item is being added to the cart  
      // or Use the disabled prop to prevent the button from being clicked while the checkout is still being initialized or the item is being added to the cart  
      // or Add a loading state to the button to indicate that the checkout is being initialized or the
      disabled={loading}  // Disable if still loading
      onClick={handleAddToCart} 
      className="add-to-cart">
      {loading ? 'Initializing...' : 'Add to Cart'}</button> 
      ) 
      : 
      ( <button 
        style={{color: 'red'}}
        type="button"
        disabled='true'
        className="add-to-cart">
        Out of Stock</button> )}
        < Outlet context={{ product }} />
    </div>

  
  )
}

export default ProductCard