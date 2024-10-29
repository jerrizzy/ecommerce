import './App.css';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Home from './components/Home';
import { useState } from 'react'
import { Outlet, useLoaderData } from "react-router-dom"


function App() {
  const [cart, setCart] = useState([]);
  // State to manage whether the product is added to the cart
  const [checkoutToken, setCheckoutToken] = useState(null) // Use token as checkout ID
  
  const user = useLoaderData()

  console.log('cart', cart)

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
