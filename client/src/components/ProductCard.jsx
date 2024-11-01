import { useState, useEffect } from 'react'
import { Link, useOutletContext } from "react-router-dom"

function ProductCard({ id, product }) {
  const { cart, setCart, checkoutToken, setCheckoutToken } = useOutletContext(); 
  const [loading, setLoading] = useState(true);  // To track if checkout is still being initialized
  console.log("product with quantity field:", product)
  const [quantity, setQuantity] = useState(product.quantity || 0); // To track

  useEffect(() => {
    setQuantity(product.quantity || 0); // Update quantity if product quantity changes
  }, [product.quantity]);  

  
  

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
      setLoading(false);  // Update loading state to false when checkout is initialized and item is added to the cart
      console.log('Checkout updated after adding item:', updatedCheckout);  // Log the updated checkout data to console for debugging
      console.log('Item added to cart:', updatedCheckout.line_items);

      // Map the Shopify response to match the simplified product structure
    const newCartItems = updatedCheckout.line_items.map(item => ({
      id: item.id,                  // Shopify item ID
      name: item.title,             // Title from Shopify response
      price: item.price,            // Price from Shopify response
      image: item.image_url,        // Match to your 'product.image' format
      quantity: item.quantity,      // Quantity in the cart
      variant_id: item.variant_id,  // Variant ID for reference
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
    </div>

  
  )
}

export default ProductCard