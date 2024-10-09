import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";


function App() {
  
  const [cartCount, setCartCount] = useState(0)

  return (
    <div>
      <Navbar cartCount={cartCount} />
     

      <div className="container">
        
      </div>

      {/* <footer>This is the footer</footer> */}
    </div>
  )
}

export default App;
