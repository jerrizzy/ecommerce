import React from 'react';
import './Footer.css'; // Import the CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Footer Logo Section */}
        <div className="footer-logo">
          <img src="/path-to-logo.png" alt="Health-Zone Logo" />
        </div>

        {/* Navigation Links */}
        <div className="footer-links">
          <ul>
            
            <li><a href="#story">Story</a></li>
            <li><a href="#guide">Nutritional Guide</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        {/* Subscription Form */}
        <div className="footer-subscribe">
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          <a href="#twitter"><i className="fa fa-twitter"></i></a>
          <a href="#facebook"><i className="fa fa-facebook"></i></a>
          <a href="#instagram"><i className="fa fa-instagram"></i></a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>© 2024 Health-Zone. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <a href="#return-policy">Return Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
