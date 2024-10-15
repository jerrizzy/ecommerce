import React from 'react'
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className='navbar'>
        <h1 className="logo">Amaze-zone</h1>

            <ul>
            <NavLink to="/" exact activeClassName="active">
                Home
            </NavLink>
            <NavLink to="/about" activeClassName="active">
                About
            </NavLink>
            <NavLink to="/contact" activeClassName="active">
                Contact
            </NavLink>
            <NavLink to="/products" activeClassName="active">
                Products
            </NavLink>
            <NavLink to="/cart" activeClassName="active">
                🛒
            </NavLink>
            </ul>
            
    </nav> 
  )
}

export default Navbar