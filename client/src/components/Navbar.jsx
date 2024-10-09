import React from 'react'
import "./NavBar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className='navbar'>
        <h1 className="logo">Amaze-zone</h1>

        <div>
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
        </div>
    </nav> 
  )
}

export default Navbar