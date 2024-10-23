import './App.css';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { useState } from 'react'
import { Outlet, useLoaderData } from "react-router-dom"


function App() {
  const [cart, setCart] = useState();
  
  const user = useLoaderData()

  return (
    <div>
      <Navbar  />
     

      <div className="container">
      <Outlet context={{ cart, setCart }} />
      </div>

      <Footer />
    </div>
  )
}

export default App;
