import { Link } from "react-router-dom"

function ProductCard({ id, product }) {
  // State to manage whether the product is added to the cart
  const [checkoutId, setCheckoutId] = useState(null);
  const [cart, setCart] = useState([]);

  // Create checkout if not already created
  useEffect(() => {
    const fetchCheckout = async () => {
      const response = await fetch('/api/create-checkout', { method: 'POST' });
      const checkout = await response.json();
      setCheckoutId(checkout.id);  // Save checkout ID
    };

    if (!checkoutId) {
      fetchCheckout();
    }
  }, [checkoutId]);

  // Function to add the product to the cart
  // Handle adding item to cart without redirecting
  const handleAddToCart = async () => {
    if (!checkoutId) {
      console.error('Checkout not initialized');
      return;
    }

    const variantId = product.variants[0].id;  // Get the variant ID
    const quantity = 1;  // You can change this to dynamic quantity
    const response = await fetch('/api/add-to-cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutId,
        variantId,
        quantity,
      })
    });

    const updatedCheckout = await response.json();
    setCart(updatedCheckout.line_items);  // Update cart state
  };



  return (
    <Link to={`/productpage/${product.id}`}>
   
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
    </div>

    </Link>
  )
}

export default ProductCard