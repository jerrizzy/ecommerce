import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    // State to manage whether the navbar is scrolled
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'white' : 'green'}`}>
    <div className="navbar-container">
        <h1 className="logo">Herbs For Life</h1>

            <ul className="nav-links">
            <NavLink to="/" exact activeClassName="active">
                Home
            </NavLink>
            
            <NavLink to="/blogs" activeClassName="active">
                Blog
            </NavLink>
            <NavLink to="/products" activeClassName="active">
                Shop
            </NavLink>
            <NavLink to="/cart" activeClassName="active" >
                🛒
            </NavLink>
            </ul>
            
            
    </div> 
    </nav>
  )
}

export default Navbar