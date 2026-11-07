
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Camera,
  Share2,
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>HOPE</h2>
          <span>TEA ESTATE · CEYLON</span>

          <p>
            Rooted in the heritage of Ceylon tea.
            Growing towards a connected future.
          </p>

          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">
              <Share2 size={20} />
            </a>

            <a href="#instagram" aria-label="Instagram">
              <Camera size={20} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/about">Our Estate</Link>
          <Link to="/collection">Tea Collection</Link>
          <Link to="/journey">Tea Journey</Link>
        </div>

        <div className="footer-column">
          <h3>Information</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/cart">Shopping Cart</Link>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>

        <div className="footer-column footer-contact">
          <h3>Get in Touch</h3>
          <p><MapPin size={16} /> Hewaheta, Sri Lanka</p>
          <p><Mail size={16} /> info@hopeteaestate.lk</p>
          <p><Phone size={16} /> Contact details coming soon</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Hope Tea Estate.
          All rights reserved.
        </p>
        <p>Made with care in Sri Lanka.</p>
      </div>
    </footer>
  );
}

export default Footer;
