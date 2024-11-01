import './App.css';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Home from './components/Home';
import { useState, useEffect } from 'react'
import { Outlet, useLoaderData } from "react-router-dom"


function App() {
  const [cart, setCart] = useState([]);
  // State to manage whether the product is added to the cart
  const [checkoutToken, setCheckoutToken] = useState(null) // Use token as checkout ID

  console.log('cart', cart)

  // Create checkout when the component mounts
  useEffect(() => {
    const fetchCheckout = async () => {
      const response = await fetch('http://localhost:3000/api/create-checkout', { method: 'POST' });
      const data = await response.json();
      if (data.token) setCheckoutToken(data.token);
    };
    fetchCheckout();
  }, []);  // Only run this once when the component mounts

  return (
    <div>
      <Navbar  />

      {/* Replace 'Home' with the actual page component */}
      
      <div className="container">
      <Outlet context={{ cart, setCart, checkoutToken, setCheckoutToken }} />
      </div>

      <Footer />
    </div>
  )
}

export default App;
