import { useState, useEffect } from 'react'
import { Link, useOutletContext, Outlet } from "react-router-dom"

function ProductCard({ id, product }) {
  const { cart, setCart, checkoutToken, setCheckoutToken } = useOutletContext(); 
  const [loading, setLoading] = useState(false);  // To track if checkout is still being initialized
  console.log("product with quantity field:", product)
  const [quantity, setQuantity] = useState(product.variants[0].inventoryQuantity || 0); // To track

  useEffect(() => {
    setQuantity(product.variants[0].inventoryQuantity || 0); // Update quantity if product quantity changes
  }, [product.variants[0].inventoryQuantity]);  


  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (!checkoutToken) {
      setLoading(true);
      console.error('Checkout not initialized');
      return;
    }

    // Ensure variantId is formatted correctly
    const variantId = product.variants[0].id.startsWith('gid://') 
      ? product.variants[0].id // Use as-is if already formatted
      : `gid://shopify/ProductVariant/${product.variants[0].id}`;

    try {
      console.log('Payload being sent:', {
        checkoutToken,
        variantId,
        quantity: 1,
      });

      const response = await fetch('http://localhost:3000/api/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutToken,
          variantId,
          quantity: 1,
        }),
      });

      const updatedCheckout = await response.json();

      console.log('Updated checkout:', updatedCheckout);

      // Update cart state with the updated items
      const newCartItems = updatedCheckout.lineItems.edges.map(({ node: item }) => ({
        id: item.id,
        name: item.title,
        price: item.variant.price.amount, // Access `price.amount` from the nested structure
        image: item.variant.image ? item.variant.image.src : '', // Safely access `image.src`
        quantity: item.quantity,
        variant_id: item.variant.id, // Variant ID for reference
        originalProductId: product.id, // Use the product ID passed down from the component
      }));
      

      setCart(newCartItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  
  
  const productId = product.id.split('/').pop();
  // explanation: The split method breaks a string into an array using the character you specify (/ in this case) as the delimiter.
  // product.id is this string => "gid://shopify/Product/8739386589403", splitting it by / produces an array:
  // ['gid:', '', 'shopify', 'Product', '8739386589403']
  // The pop method removes and returns the last element of an array.
  // In this case, the last element of the array is '8739386589403' (the numeric ID)

  return (
    <div className="product-card">
      <Link to={`/productpage/${productId}`}>
      <img src={product.image} alt={product.name} />
      <h3>{product.title}</h3>
      <p>$ {product.variants[0].price}</p>
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
        {/* < Outlet context={{ product }} /> */}
    </div>

  
  )
}

export default ProductCard