import React from 'react'
import './Home.css';

function Home() {
  return (
    <div className="home-background">
    <div className="home-content">
      {/* Place all your content here */}
      <h1>Welcome to Our Store</h1>
      <a  href="/products"><button  className="bn632-hover bn19">Explore!</button></a>
      <p>Discover our fresh, healthy products!</p>
    </div>
  </div>
  )
}

export default Home