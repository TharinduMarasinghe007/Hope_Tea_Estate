import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const currentYear = new Date().getFullYear();

function Footer() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Our Estate", path: "/about" },
    { name: "Our Teas", path: "/collection" },
    { name: "Tea Journey", path: "/journey" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Left: Brand */}
        <div className="footer-brand-wrap">
          <BrandLogo light={true} />
        </div>

        {/* Center: Navigation Links */}
        <nav className="footer-links-row" aria-label="Footer Navigation">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="footer-nav-link">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Social Media Icons in Circular Badges */}
        <div className="footer-social-row">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="footer-social-icon"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="footer-social-icon"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="footer-social-icon"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
            </svg>
          </a>

          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
            className="footer-social-icon"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom-line">
        <p>© {currentYear} Hope Tea Estate · Hewaheta, Sri Lanka. All rights reserved.</p>
        <div className="footer-legal-links">
          <Link to="/about">Our Estate</Link>
          <span>·</span>
          <Link to="/collection">Tea Shop</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
